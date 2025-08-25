export type ApiTodo = { _id: string; title: string; completed: boolean }

export class ApiClient {
  private getAuthHeaders(token: string | null): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  async register(email: string, password: string): Promise<string> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Register failed')
    const data = (await res.json()) as { token: string }
    return data.token
  }

  async login(email: string, password: string): Promise<string> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    const data = (await res.json()) as { token: string }
    return data.token
  }

  async listTodos(token: string): Promise<ApiTodo[]> {
    const res = await fetch('/api/todos', { headers: this.getAuthHeaders(token) })
    if (!res.ok) throw new Error('Load todos failed')
    return (await res.json()) as ApiTodo[]
  }

  async addTodo(token: string, title: string): Promise<ApiTodo> {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ title }),
    })
    if (!res.ok) throw new Error('Add todo failed')
    return (await res.json()) as ApiTodo
  }

  async updateTodo(token: string, id: string, patch: Partial<Pick<ApiTodo, 'title' | 'completed'>>): Promise<void> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(patch),
    })
    if (!res.ok) throw new Error('Update todo failed')
  }

  async deleteTodo(token: string, id: string): Promise<void> {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE', headers: this.getAuthHeaders(token) })
    if (!res.ok) throw new Error('Delete todo failed')
  }
}

export const api = new ApiClient()


