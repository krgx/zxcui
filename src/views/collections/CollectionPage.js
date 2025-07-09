import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  CCard, 
  CCardBody, 
  CCardTitle, 
  CButton, 
  CRow, 
  CCol, 
  CSpinner,
  CCardImage,
  CFormSelect,
  CCardText,
  CContainer
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'

const API_URL = 'http://212.193.27.132/fastapi/api/v1'
const AUTH_HEADER = {
  headers: {
    'Authorization': 'Basic ' + btoa('catalog_mvp:tzlQQsKA')
  }
}

const CollectionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [configurations, setConfigurations] = useState([])
  const [selectedConfiguration, setSelectedConfiguration] = useState(null)
  const [calculatedPrice, setCalculatedPrice] = useState(null)

  // Загрузка коллекции и её продуктов
  useEffect(() => {
    setLoading(true)
    Promise.all([
      // Получаем список всех коллекций и находим нужную по id
      axios.get(`${API_URL}/collections`, {
        ...AUTH_HEADER,
        params: { sort_by: 'id', order: 'asc' }
      }),
      // Получаем продукты коллекции
      axios.get(`${API_URL}/collections/${id}/products`, AUTH_HEADER)
    ])
      .then(([collectionsRes, prodRes]) => {
        // Находим нужную коллекцию по id
        const foundCollection = collectionsRes.data.find(col => col.id === Number(id))
        if (!foundCollection) {
          throw new Error('Collection not found')
        }
        setCollection(foundCollection)
        setProducts(prodRes.data)
      })
      .catch(error => {
        console.error('Error loading collection:', error)
        setCollection(null)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [id])

  // Загрузка конфигураций при выборе продукта
  useEffect(() => {
    if (!selectedProduct) return
    
    axios.get(`${API_URL}/products/${selectedProduct.id}/configurations`, {
      ...AUTH_HEADER,
      params: { subcategory_id: selectedProduct.subcategory_id }
    })
      .then(res => {
        setConfigurations(res.data)
        if (res.data.length > 0) {
          setSelectedConfiguration(res.data[0])
        }
      })
      .catch(error => {
        console.error('Error loading configurations:', error)
        setConfigurations([])
      })
  }, [selectedProduct])

  // Расчет цены при выборе конфигурации
  useEffect(() => {
    if (!selectedConfiguration) return

    // TODO: Добавить вызов API для расчета цены
    // Нужно использовать POST /api/v1/prices/sum с правильными параметрами
    setCalculatedPrice('от 150 000 ₽')
  }, [selectedConfiguration])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <CSpinner color="primary" />
    </div>
  )
  
  if (!collection) return (
    <CContainer>
      <div className="text-center my-5">
        <h4 className="text-danger">Коллекция не найдена</h4>
        <CButton 
          color="primary" 
          variant="ghost" 
          className="mt-3"
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </CButton>
      </div>
    </CContainer>
  )

  return (
    <CContainer className="py-4">
      {selectedProduct ? (
        // Детальный вид продукта
        <div>
          <CButton 
            color="primary"
            variant="ghost"
            className="mb-4 px-0"
            onClick={() => {
              setSelectedProduct(null)
              setSelectedConfiguration(null)
            }}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Назад к коллекции
          </CButton>
          
          <CRow>
            <CCol lg={6} className="mb-4 mb-lg-0">
              <CCard className="h-100 border-0 shadow-sm">
                <div style={{
                  height: '500px',
                  background: 'var(--cui-card-cap-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem'
                }}>
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.label}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className="text-muted">Изображение отсутствует</div>
                  )}
                </div>
              </CCard>
            </CCol>
            
            <CCol lg={6}>
              <div className="sticky-top" style={{ top: '2rem' }}>
                <h2 className="mb-3 fw-bold">{selectedProduct.label}</h2>
                <p className="text-muted fs-5 mb-4">
                  {selectedProduct.subcategory?.label}
                </p>
                
                {configurations.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">Выберите конфигурацию:</label>
                    <CFormSelect
                      size="lg"
                      value={selectedConfiguration?.id || ''}
                      onChange={(e) => {
                        const config = configurations.find(c => c.id === Number(e.target.value))
                        setSelectedConfiguration(config)
                      }}
                    >
                      {configurations.map(config => (
                        <option key={config.id} value={config.id}>
                          {config.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                )}
                
                {selectedConfiguration && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-baseline mb-4">
                      <h3 className="h5 mb-0">Стоимость:</h3>
                      <div className="h3 mb-0 fw-bold">{calculatedPrice}</div>
                    </div>
                    <CButton 
                      color="primary"
                      size="lg"
                      className="w-100 py-3"
                      onClick={() => navigate(`/calculator/${selectedConfiguration.id}`)}
                    >
                      Рассчитать стоимость
                    </CButton>
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
        </div>
      ) : (
        // Список продуктов коллекции
        <>
          <div className="mb-5">
            <h2 className="fw-bold mb-1">Коллекция {collection.label}</h2>
            <p className="text-muted fs-5">Выберите интересующий вас товар для просмотра конфигураций</p>
          </div>
          
          <CRow>
            {products.length === 0 ? (
              <CCol xs={12}>
                <div className="text-center text-muted py-5">
                  <h4>В данной коллекции пока нет товаров</h4>
                </div>
              </CCol>
            ) : (
              products.map(product => (
                <CCol key={product.id} sm={6} lg={4} xl={3} className="mb-4">
                  <CCard 
                    className="h-100 border-0 shadow-sm product-card" 
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div style={{
                      height: '280px',
                      background: 'var(--cui-card-cap-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.5rem'
                    }}>
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.label} 
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <div className="text-muted">Нет изображения</div>
                      )}
                    </div>
                    <CCardBody>
                      <h3 className="h5 fw-semibold mb-2">{product.label}</h3>
                      <p className="text-muted mb-3 small">{product.subcategory?.label}</p>
                      <CButton 
                        color="primary"
                        variant="outline"
                        className="w-100"
                      >
                        Подробнее
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))
            )}
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default CollectionPage 