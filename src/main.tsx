import { createRoot } from 'react-dom/client'
import './App.css'
import MainPage from './pages/MainPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import ProtectedRoute from './services/ProtectedRoute.tsx'
import AdminUsersDashboardPage from './pages/AdminUsersDashboardPage.tsx'
import AdminUserDetailsPage from './pages/AdminUserDetailsPage.tsx'
import ProtectedAdminRoute from './services/ProtectedAdminRoute.tsx'
import NotFound from './pages/404.tsx'
import ConvertPage from './pages/ConvertPage.tsx'
import AdminVideoDetailsPage from './pages/AdminVideoDetailsPage.tsx'
import AdminVideos from './pages/AdminVideos.tsx'
import RecentQueries from './pages/RecentQueries.tsx'
import ConvertedHistory from './pages/ConvertedHistory.tsx'
import AdminUploadCookiePage from './pages/AdminUploadCookie.tsx'

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
    element: <ProtectedAdminRoute>
    <MainLayout>
      <AdminUsersDashboardPage />
    </MainLayout>
  </ProtectedAdminRoute>
  },
  {
    path: '/admin/user/:id',
    element: <ProtectedAdminRoute>
    <MainLayout>
      <AdminUserDetailsPage />
    </MainLayout>
  </ProtectedAdminRoute>
  },
  {
    path: '/admin/cookies/',
    element: <ProtectedAdminRoute>
    <MainLayout>
      <AdminUploadCookiePage />
    </MainLayout>
  </ProtectedAdminRoute>
  },
  {
    path: '/admin/video/:videoId',
    element: <ProtectedAdminRoute>
      <MainLayout>
        <AdminVideoDetailsPage/>
      </MainLayout>
    </ProtectedAdminRoute>
  },
  {
    path: '/admin/videos',
    element: <ProtectedAdminRoute>
      <MainLayout>
        <AdminVideos/>
      </MainLayout>
    </ProtectedAdminRoute>
  },
  {
    path: '/convert',
    element: <ProtectedRoute>
      <MainLayout>
        <ConvertPage/>
      </MainLayout>
    </ProtectedRoute>
  },
  {
    path: '/converted-history',
    element: <ProtectedRoute>
      <MainLayout>
        <ConvertedHistory/>
      </MainLayout>
    </ProtectedRoute>
  },
  {
    path: '/recent',
    element: <ProtectedRoute>
      <MainLayout>
        <RecentQueries/>
      </MainLayout>
    </ProtectedRoute>
  },
  {
    path: '*',
    element: <NotFound/> 
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
