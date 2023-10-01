import { Skeleton, Card, Row, Col } from 'antd'

export function WelcomeSkeleton() {
  return (
    <Row gutter={[32, 32]}>
      <Col sm={12}>
        <Skeleton active />
        <Skeleton active />
      </Col>

      <Col sm={12}>
        <div
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#EBECF0',
          }}
        />
      </Col>
    </Row>
  )
}

export function KategoriSkeleton() {
  return (
    <Row>
      <Col sm={6}>
        <Skeleton active />
      </Col>

      <Col xs={24}>
        <Row gutter={[16, 32]}>
          {[1, 2, 3, 4].map((row) => (
            <Col key={row} xs={23} sm={12} md={8} lg={8} xl={6}>
              <Card
                style={{
                  borderRadius: '24px',
                  border: 0,
                }}
              >
                <Skeleton.Avatar shape="circle" size="large" active />
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}

export function ClassRecomendationComponentSkeleton() {
  return (
    <Row>
      <Col sm={6}>
        <Skeleton active />
      </Col>

      <Col xs={24}>
        <Row gutter={[16, 32]}>
          {[1, 2, 3].map((row) => (
            <Col key={row} xs={24} sm={12} md={8} lg={8} xl={8}>
              <div>
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#EBECF0',
                    borderRadius: '24px 24px 0 0',
                    border: 0,
                  }}
                />
                <Card
                  style={{
                    borderRadius: '0 0 24px 24px',
                    border: 0,
                  }}
                >
                  <Skeleton active />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}
