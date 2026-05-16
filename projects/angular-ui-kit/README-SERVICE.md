# BaseService Documentation

## Overview

`BaseService` adalah service yang menyediakan HTTP client wrapper untuk membuat request HTTP (GET, POST, PATCH, PUT, DELETE) dengan fitur konfigurasi URL base yang fleksibel, support multiple projects, dan automatic data unwrapping dari API response.

## Setup & Configuration

### 1. Konfigurasi Dasar (String URL)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideBaseService } from '@angular/ui-kit';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideBaseService('https://api.example.com'),
  ],
});
```

### 2. Konfigurasi dengan Object Config

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideBaseService({
      baseUrl: 'https://api.example.com',
      defaultProject: 'api',
    }),
  ],
});
```

### 3. Konfigurasi Multiple Projects

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideBaseService({
      defaultProject: 'primary',
      projects: {
        primary: 'https://api.example.com',
        secondary: 'https://api-backup.example.com',
        analytics: {
          baseUrl: 'https://analytics.example.com',
          headers: {
            'X-Analytics-Key': 'your-key',
          },
          withCredentials: true,
        },
      },
    }),
  ],
});
```

## Basic Usage

### 1. GET Request

```typescript
import { Component, inject } from '@angular/core';
import { BaseService } from '@angular/ui-kit';

@Component({
  selector: 'app-users',
  template: `<div>{{ users | json }}</div>`,
})
export class UsersComponent {
  private baseService = inject(BaseService);

  ngOnInit() {
    // Simple GET request
    this.baseService.get<User[]>('/users').subscribe(
      (users) => console.log(users),
    );

    // GET dengan query parameters
    this.baseService.get<User[]>('/users', {
      page: 1,
      limit: 10,
      search: 'john',
    }).subscribe((users) => console.log(users));
  }
}
```

### 2. GET dengan Response Wrapper

Gunakan `getResponse<T>` jika Anda ingin mengakses seluruh response object termasuk metadata, pagination, message, dll.

```typescript
this.baseService.getResponse<User[]>('/users').subscribe(
  (response) => {
    console.log('Data:', response.data);
    console.log('Message:', response.message);
    console.log('Pagination:', response.pagination);
  },
);
```

### 3. GET List dengan Pagination

```typescript
this.baseService.getList<User>('/users', {
  page: 1,
  limit: 20,
  sort: 'name',
  sortDirection: 'asc',
}).subscribe(
  (result) => {
    console.log('Users:', result.data);
    console.log('Pagination:', result.pagination);
    // result.pagination = { page, limit, total, totalPage }
  },
);
```

### 4. POST Request

```typescript
const newUser: CreateUserRequest = {
  name: 'John Doe',
  email: 'john@example.com',
};

this.baseService.post<User>('/users', newUser).subscribe(
  (user) => console.log('Created:', user),
);
```

### 5. PATCH Request

```typescript
const updates: Partial<User> = {
  name: 'Jane Doe',
};

this.baseService.patch<User>(`/users/${userId}`, updates).subscribe(
  (user) => console.log('Updated:', user),
);
```

### 6. PUT Request

```typescript
const updatedUser: User = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
};

this.baseService.put<User>(`/users/${userId}`, updatedUser).subscribe(
  (user) => console.log('Replaced:', user),
);
```

### 7. DELETE Request

```typescript
this.baseService.delete<{ success: boolean }>(`/users/${userId}`).subscribe(
  (result) => console.log('Deleted:', result),
);
```

## Advanced Features

### 1. File Upload

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('description', 'My file');

this.baseService.upload<{ fileId: string }>('/upload', formData).subscribe(
  (result) => console.log('Uploaded:', result.fileId),
);
```

### 2. Menggunakan Multiple Projects

```typescript
// Gunakan project 'analytics' untuk request ini
this.baseService.get<AnalyticsData>(
  '/data',
  undefined,
  { project: 'analytics' },
).subscribe((data) => console.log(data));

// Gunakan default project
this.baseService.get<User[]>('/users').subscribe(
  (users) => console.log(users),
);
```

### 3. Custom Headers & Options

```typescript
this.baseService.get<User[]>(
  '/users',
  { page: 1, limit: 10 },
  {
    headers: {
      'X-Custom-Header': 'custom-value',
      'Authorization': 'Bearer token',
    },
    withCredentials: true,
  },
).subscribe((users) => console.log(users));
```

### 4. Custom HTTP Context

```typescript
import { HttpContextToken } from '@angular/common/http';

const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

this.baseService.get<User[]>(
  '/users',
  undefined,
  {
    context: new HttpContext().set(SKIP_LOADER, true),
  },
).subscribe((users) => console.log(users));
```

### 5. Absolute URLs

BaseService mendukung absolute URLs, sehingga Anda dapat melakukan request ke URL yang berbeda dari baseUrl yang dikonfigurasi:

```typescript
// Request ke external API
this.baseService.get<ExternalData>(
  'https://external-api.com/data',
).subscribe((data) => console.log(data));
```

## Interfaces & Types

### ApiResponse<T>

Struktur response default dari API:

```typescript
interface ApiResponse<T> {
  data?: T | null;
  pagination?: PaginationMeta | null;
  message?: string;
  status?: string | number;
  [key: string]: unknown;
}
```

### PaginatedList<T>

Struktur hasil dari `getList()`:

```typescript
interface PaginatedList<T> {
  data: T[];
  pagination: PaginationMeta;
}
```

### PaginationMeta

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  [key: string]: unknown;
}
```

### ListQueryParams

Query parameters yang umum digunakan:

```typescript
interface ListQueryParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string;
  sort?: string;
  sortBy?: string;
  sortDirection?: string;
}
```

### BaseServiceProjectConfig

Konfigurasi per project:

```typescript
interface BaseServiceProjectConfig {
  baseUrl: string;
  headers?: HttpHeaders | Record<string, string | string[]>;
  withCredentials?: boolean;
}
```

### BaseServiceRequestOptions

Options yang dapat diberikan per request:

```typescript
interface BaseServiceRequestOptions {
  project?: string;  // Nama project yang akan digunakan
  params?: HttpParams | Record<string, unknown>;
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  withCredentials?: boolean;
}
```

## Common Patterns

### 1. Generic HTTP Service

```typescript
import { Injectable, inject } from '@angular/core';
import { BaseService } from '@angular/ui-kit';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseService = inject(BaseService);
  private apiPath = '/users';

  getAll(page: number = 1, limit: number = 10): Observable<PaginatedList<User>> {
    return this.baseService.getList<User>(this.apiPath, { page, limit });
  }

  getById(id: number): Observable<User> {
    return this.baseService.get<User>(`${this.apiPath}/${id}`);
  }

  create(user: CreateUserRequest): Observable<User> {
    return this.baseService.post<User>(this.apiPath, user);
  }

  update(id: number, updates: Partial<User>): Observable<User> {
    return this.baseService.patch<User>(`${this.apiPath}/${id}`, updates);
  }

  delete(id: number): Observable<void> {
    return this.baseService.delete<void>(`${this.apiPath}/${id}`);
  }
}
```

### 2. Error Handling

```typescript
this.baseService.get<User[]>('/users').subscribe({
  next: (users) => console.log(users),
  error: (error) => {
    console.error('Error:', error.error?.message || error.message);
  },
});
```

### 3. dengan RxJS Operators

```typescript
import { catchError, finalize } from 'rxjs/operators';

this.baseService.get<User[]>('/users')
  .pipe(
    catchError((error) => {
      console.error('Error loading users:', error);
      return of([]); // Return default empty array
    }),
    finalize(() => console.log('Request completed')),
  )
  .subscribe((users) => console.log(users));
```

## Tips & Best Practices

1. **Selalu define type generics** untuk type safety:
   ```typescript
   this.baseService.get<User[]>('/users') // ✓ Good
   this.baseService.get('/users') // ✗ Avoid (returns any)
   ```

2. **Gunakan specific project** jika memiliki multiple API backends:
   ```typescript
   this.baseService.get<Data>('/endpoint', undefined, { project: 'analytics' })
   ```

3. **Untuk list dengan pagination**, gunakan `getList()` daripada `get()`:
   ```typescript
   this.baseService.getList<User>('/users', { page, limit }) // ✓ Better
   ```

4. **Wrap BaseService dalam domain-specific services**:
   ```typescript
   @Injectable()
   export class UserService {
     constructor(private baseService: BaseService) {}
     // Domain-specific methods
   }
   ```

5. **Handle pagination metadata** dari `getList()`:
   ```typescript
   result.pagination.totalPage // Useful for pagination UI
   ```

## Troubleshooting

### "BaseService project is not configured"

Pastikan project yang Anda gunakan telah dikonfigurasi:

```typescript
// ✓ Correct: Project 'analytics' exists
this.baseService.get('/data', undefined, { project: 'analytics' })

// ✗ Wrong: Project 'unknown' doesn't exist
this.baseService.get('/data', undefined, { project: 'unknown' })
```

### CORS Issues

Gunakan `withCredentials` option dan configure headers sesuai kebutuhan:

```typescript
this.baseService.get<Data>('/endpoint', undefined, {
  withCredentials: true,
  headers: {
    'Authorization': 'Bearer token',
  },
})
```

### Empty Response Data

Jika API mengembalikan response dengan `data: null`, `get()` akan return `null`. Gunakan `getResponse()` jika ingin mengakses full response:

```typescript
this.baseService.getResponse<User>('/users/999').subscribe(
  (response) => {
    console.log(response.data); // null jika user tidak ada
    console.log(response.message); // Mungkin: "User not found"
  },
);
```
