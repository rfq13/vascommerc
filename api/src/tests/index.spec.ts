import { Server } from 'server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { describe } from 'mocha'
import { Application } from 'express'
import { DUMMY_EMAIL, DUMMY_PASSWORD } from '@config/env'

chai.use(chaiHttp)
chai.should()

let server: Application
const customData: any = {}

before(async (done) => {
  server = Server.getServer()

  done()
})
describe('Vascommerce', () => {
  describe('GET /health', async () => {
    it('should get health data', (done) => {
      chai
        .request(server)
        .get('/health')
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
  })
  describe('TEST /auth', () => {
    it('POST /auth/sign-up => should regist the customer', (done) => {
      chai
        .request(server)
        .post(`/auth/sign-up`)
        .send({
          email: DUMMY_EMAIL,
          fullName: 'Rfq13',
          phone: '6281232072122',
          password: DUMMY_PASSWORD,
        })
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('POST /auth/sign-in => login user - should return user token', (done) => {
      chai
        .request(server)
        .post(`/auth/sign-in`)
        .send({
          email: DUMMY_EMAIL,
          password: DUMMY_PASSWORD,
          fcmToken: 'dfsdfd',
        })
        .end((_err, res) => {
          // token = res.body.accessToken
          customData.user = res.body.user
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('POST /auth/admin/sign-in => login admin - should return admin token', (done) => {
      chai
        .request(server)
        .post(`/auth/admin/sign-in`)
        .send({
          email: 'super.admin@mail.com',
          password: '12345678',
        })
        .end((_err, res) => {
          customData.adminToken = res.body.accessToken
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
  })
})
