export type ApiTodo = { _id: string; title: string; completed: boolean }

// Use environment base URL in production; fall back to relative paths (dev proxy)
const BASE =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
    : ''

function u(path: string) {
  return `${BASE}${path}`
}

function authHeaders(token?: string | null): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

export class ApiClient {
  async register(email: string, password: string): Promise<string> {
    const res = await fetch(u('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Register failed')
    const data = (await res.json()) as { token: string }
    return data.token
  }

  async login(email: string, password: string): Promise<string> {
    const res = await fetch(u('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    const data = (await res.json()) as { token: string }
    return data.token
  }

  async listTodos(token: string): Promise<ApiTodo[]> {
    const res = await fetch(u('/api/todos'), { headers: authHeaders(token) })
    if (!res.ok) throw new Error('Load todos failed')
    return (await res.json()) as ApiTodo[]
  }

  async addTodo(token: string, title: string): Promise<ApiTodo> {
    const res = await fetch(u('/api/todos'), {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ title }),
    })
    if (!res.ok) throw new Error('Add todo failed')
    return (await res.json()) as ApiTodo
  }

  async updateTodo(
    token: string,
    id: string,
    patch: Partial<Pick<ApiTodo, 'title' | 'completed'>>
  ): Promise<void> {
    const res = await fetch(u(`/api/todos/${id}`), {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify(patch),
    })
    if (!res.ok) throw new Error('Update todo failed')
  }

  async deleteTodo(token: string, id: string): Promise<void> {
    const res = await fetch(u(`/api/todos/${id}`), {
      method: 'DELETE',
      headers: authHeaders(token),
    })
    if (!res.ok) throw new Error('Delete todo failed')
  }
}

export const api = new ApiClient()


