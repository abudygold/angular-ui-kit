import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import {
	EnvironmentProviders,
	inject,
	Injectable,
	InjectionToken,
	makeEnvironmentProviders,
	Provider,
} from '@angular/core';
import { map, Observable } from 'rxjs';

export const DEFAULT_BASE_SERVICE_PROJECT = 'default';

export interface ApiResponse<T> {
	data?: T | null;
	pagination?: PaginationMeta | null;
	message?: string;
	status?: string | number;
	[key: string]: unknown;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPage: number;
	[key: string]: unknown;
}

export interface PaginatedList<T> {
	data: T[];
	pagination: PaginationMeta;
}

export interface ListQueryParams extends Record<string, unknown> {
	page?: number;
	limit?: number;
	search?: string;
	keyword?: string;
	sort?: string;
	sortBy?: string;
	sortDirection?: string;
}

export interface BaseServiceProjectConfig {
	baseUrl: string;
	headers?: HttpHeaders | Record<string, string | string[]>;
	withCredentials?: boolean;
}

export type BaseServiceProjectInput = string | BaseServiceProjectConfig;

export interface BaseServiceProject extends BaseServiceProjectConfig {
	name: string;
}

export interface BaseServiceConfig {
	baseUrl?: string;
	defaultProject?: string;
	projects?: Record<string, BaseServiceProjectInput>;
}

export interface BaseServiceRequestOptions {
	project?: string;
	params?: HttpParams | Record<string, unknown>;
	headers?: HttpHeaders | Record<string, string | string[]>;
	context?: HttpContext;
	withCredentials?: boolean;
}

export const BASE_SERVICE_PROJECTS = new InjectionToken<readonly BaseServiceProject[]>(
	'BASE_SERVICE_PROJECTS',
);

export const BASE_SERVICE_DEFAULT_PROJECT = new InjectionToken<string>(
	'BASE_SERVICE_DEFAULT_PROJECT',
);

export const provideBaseService = (config: string | BaseServiceConfig): EnvironmentProviders => {
	const normalized = normalizeBaseServiceConfig(config);
	const providers: Provider[] = [
		{
			provide: BASE_SERVICE_DEFAULT_PROJECT,
			useValue: normalized.defaultProject,
		},
		...normalized.projects.map((project) => ({
			provide: BASE_SERVICE_PROJECTS,
			multi: true,
			useValue: project,
		})),
	];

	return makeEnvironmentProviders(providers);
};

@Injectable({ providedIn: 'root' })
export class BaseService {
	private readonly http = inject(HttpClient);
	private readonly defaultProject =
		inject(BASE_SERVICE_DEFAULT_PROJECT, { optional: true }) ?? DEFAULT_BASE_SERVICE_PROJECT;
	private readonly projects = inject(BASE_SERVICE_PROJECTS, { optional: true }) ?? [];

	get<T>(
		path: string,
		params?: ListQueryParams | Record<string, unknown>,
		options?: BaseServiceRequestOptions,
	): Observable<T> {
		return this.getResponse<T>(path, params, options).pipe(map((res) => this.unwrapData(res)));
	}

	getResponse<T>(
		path: string,
		params?: ListQueryParams | Record<string, unknown>,
		options?: BaseServiceRequestOptions,
	): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(
			this.buildUrl(path, options),
			this.createHttpOptions(params, options),
		);
	}

	getList<T>(
		path: string,
		params?: ListQueryParams,
		options?: BaseServiceRequestOptions,
	): Observable<PaginatedList<T>> {
		return this.getResponse<T[]>(path, params, options).pipe(
			map((res) => ({
				data: res.data ?? [],
				pagination: res.pagination ?? this.getDefaultPagination(),
			})),
		);
	}

	post<T, B = unknown>(
		path: string,
		body: B,
		options?: BaseServiceRequestOptions,
	): Observable<T> {
		return this.http
			.post<
				ApiResponse<T>
			>(this.buildUrl(path, options), body, this.createHttpOptions(undefined, options))
			.pipe(map((res) => this.unwrapData(res)));
	}

	patch<T, B = unknown>(
		path: string,
		body: B,
		options?: BaseServiceRequestOptions,
	): Observable<T> {
		return this.http
			.patch<
				ApiResponse<T>
			>(this.buildUrl(path, options), body, this.createHttpOptions(undefined, options))
			.pipe(map((res) => this.unwrapData(res)));
	}

	put<T, B = unknown>(path: string, body: B, options?: BaseServiceRequestOptions): Observable<T> {
		return this.http
			.put<
				ApiResponse<T>
			>(this.buildUrl(path, options), body, this.createHttpOptions(undefined, options))
			.pipe(map((res) => this.unwrapData(res)));
	}

	delete<T>(path: string, options?: BaseServiceRequestOptions): Observable<T> {
		return this.http
			.delete<
				ApiResponse<T>
			>(this.buildUrl(path, options), this.createHttpOptions(options?.params, options))
			.pipe(map((res) => this.unwrapData(res)));
	}

	upload<T>(
		path: string,
		formData: FormData,
		options?: BaseServiceRequestOptions,
	): Observable<T> {
		return this.post<T, FormData>(path, formData, options);
	}

	buildUrl(path: string, options?: Pick<BaseServiceRequestOptions, 'project'>): string {
		if (this.isAbsoluteUrl(path)) return path;

		const project = this.resolveProject(options?.project);
		return this.joinUrl(project.baseUrl, path);
	}

	private createHttpOptions(
		params?: HttpParams | Record<string, unknown>,
		options?: BaseServiceRequestOptions,
	): {
		params: HttpParams;
		headers?: HttpHeaders;
		context?: HttpContext;
		withCredentials?: boolean;
	} {
		const project = this.resolveProject(options?.project);

		return {
			params: this.toHttpParams(options?.params ?? params),
			headers: this.mergeHeaders(project.headers, options?.headers),
			context: options?.context,
			withCredentials: options?.withCredentials ?? project.withCredentials,
		};
	}

	private resolveProject(projectName?: string): BaseServiceProject {
		const requestedProject = projectName ?? this.defaultProject;
		const projects = new Map(this.projects.map((project) => [project.name, project]));
		const project = projects.get(requestedProject);

		if (project) return project;

		if (projectName) {
			throw new Error(`BaseService project "${projectName}" is not configured.`);
		}

		return {
			name: DEFAULT_BASE_SERVICE_PROJECT,
			baseUrl: '',
		};
	}

	private unwrapData<T>(response: ApiResponse<T>): T {
		return response.data as T;
	}

	private getDefaultPagination(): PaginationMeta {
		return {
			page: 1,
			limit: 10,
			total: 0,
			totalPage: 0,
		};
	}

	private toHttpParams(params?: HttpParams | Record<string, unknown>): HttpParams {
		if (params instanceof HttpParams) return params;

		let httpParams = new HttpParams();
		if (!params) return httpParams;

		for (const key of Object.keys(params)) {
			const value = params[key];
			if (this.isEmptyParam(value)) continue;

			if (Array.isArray(value)) {
				for (const item of value) {
					if (!this.isEmptyParam(item)) {
						httpParams = httpParams.append(key, String(item));
					}
				}
				continue;
			}

			httpParams = httpParams.set(key, String(value));
		}

		return httpParams;
	}

	private mergeHeaders(
		projectHeaders?: BaseServiceProjectConfig['headers'],
		requestHeaders?: BaseServiceRequestOptions['headers'],
	): HttpHeaders | undefined {
		let headers = this.toHttpHeaders(projectHeaders);
		const overrides = this.toHttpHeaders(requestHeaders);

		if (!headers) return overrides;
		if (!overrides) return headers;

		for (const key of overrides.keys()) {
			headers = headers.set(key, overrides.getAll(key) ?? []);
		}

		return headers;
	}

	private toHttpHeaders(
		headers?: HttpHeaders | Record<string, string | string[]>,
	): HttpHeaders | undefined {
		if (!headers) return undefined;
		return headers instanceof HttpHeaders ? headers : new HttpHeaders(headers);
	}

	private joinUrl(baseUrl: string, path: string): string {
		if (!baseUrl) return path;

		const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
		const normalizedPath = path.replace(/^\/+/, '');

		return normalizedPath ? `${normalizedBaseUrl}/${normalizedPath}` : normalizedBaseUrl;
	}

	private isAbsoluteUrl(path: string): boolean {
		return /^https?:\/\//i.test(path);
	}

	private isEmptyParam(value: unknown): boolean {
		return value === undefined || value === null || value === '';
	}
}

const normalizeBaseServiceConfig = (
	config: string | BaseServiceConfig,
): { defaultProject: string; projects: BaseServiceProject[] } => {
	if (typeof config === 'string') {
		return {
			defaultProject: DEFAULT_BASE_SERVICE_PROJECT,
			projects: [
				{
					name: DEFAULT_BASE_SERVICE_PROJECT,
					baseUrl: config,
				},
			],
		};
	}

	const projects: BaseServiceProject[] = [];

	if (config.baseUrl !== undefined) {
		projects.push({
			name: DEFAULT_BASE_SERVICE_PROJECT,
			baseUrl: config.baseUrl,
		});
	}

	for (const [name, project] of Object.entries(config.projects ?? {})) {
		projects.push(normalizeProject(name, project));
	}

	return {
		defaultProject:
			config.defaultProject ?? projects.at(0)?.name ?? DEFAULT_BASE_SERVICE_PROJECT,
		projects,
	};
};

const normalizeProject = (name: string, project: BaseServiceProjectInput): BaseServiceProject => {
	if (typeof project === 'string') {
		return {
			name,
			baseUrl: project,
		};
	}

	return {
		name,
		...project,
	};
};
