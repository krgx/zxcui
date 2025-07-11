import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'

const Page500 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">500</h1>
              <h4 className="pt-3">Хьюстон, у нас проблема!</h4>
              <p className="text-medium-emphasis float-start">
                Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.
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

export default Page500
