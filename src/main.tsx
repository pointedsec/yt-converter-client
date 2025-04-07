import { createRoot } from 'react-dom/client'
import './App.css'
import MainPage from './pages/MainPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import ProtectedRoute from './services/ProtectedRoute.tsx'
import AdminUsersDashboardPage from './pages/AdminUsersDashboardPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MainPage />
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element:
      <LoginPage />
  },
  {
    path: '/admin',
    element: <ProtectedRoute>
    <MainLayout>
      <AdminUsersDashboardPage />
    </MainLayout>
  </ProtectedRoute>
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
