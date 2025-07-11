import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'

const Page404 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Упс! Вы заблудились.</h4>
              <p className="text-medium-emphasis float-start">
                Страница, которую вы ищете, не существует.
              </p>
            </div>
            <Link to="/">
              <CButton color="info">На главную</CButton>
            </Link>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
