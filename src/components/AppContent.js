import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import ProtectedRoute from '../utils/ProtectedRoute'

const AppContent = () => {
  return (
    <CContainer className="" style={{marginTop:'-12px'}} lg>
      <Suspense fallback={<CSpinner color="primary" />}>
      <ProtectedRoute>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
        </ProtectedRoute>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
