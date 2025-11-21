import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  Select,
  Form,
  Spin,
  Table,
  Pagination,
  Input,
  Divider,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import reportService from "../../services/report-service";
import dayjs from "dayjs";

import editar from '../../assets/icons/editar.png'
import facebook from '../../assets/icons/facebook.png'
import instagram from '../../assets/icons/instagram.png'
import list from '../../assets/icons/list.png'
import phone from '../../assets/icons/phone.png'
import twitter from '../../assets/icons/twitter.png'
import whatsapp from '../../assets/icons/whatsapp.png'


import { gremios, generos, tipos, tipos_candidato, lideres } from "../../config/listado-reportes";
import { FileSearchOutlined, SearchOutlined } from "@ant-design/icons";
import { URL_BASE } from "../../config/url-server";



export const CardAmigos = () => {


  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [recordList, setRecordList] = useState([])
  const [findName, setFindName] = useState("");



  const searchByName = (e) => {
    const name = e.target.value
    if (name.length >= 3) {
      setPage(1)
      setFindName(name)
    }

    if (name == "") {
      setPage(1)
      setFindName(name)
    }

  }





  const onFinish = async (values) => {
    console.log("Success:", values);
    setPage(1)
    fetchMovements(page, pageSize)
  };




  const fetchMovements = async (page, pageSize) => {
    const tipo = form.getFieldValue("tipo")
    const genero = form.getFieldValue("genero")
    const gremio = form.getFieldValue("gremio")
    const candidato = form.getFieldValue("candidato")
    const params = { page, limit: pageSize, tipo, genero, gremio, candidato, findName }

    //tipo: 0, genero: 0, gremio: 0, candidato: 0
    setLoading(true);
    try {
      const response = await reportService.amigosReport(params)
      if (response.success) {
        console.log(response.data)
        setRecordList(response.data)
        setTotal(response.total);
      }
    } catch (error) {
      console.error("Error al obtener los movimientos:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchMovements(page, pageSize);
  }, [page, pageSize, findName]);


  useEffect(() => {
    // getFinalProducts()
  }, []);




  return (

    <div className="card p-2  bg-light">
      <div className=" row ">
        <Row >

          <Col span={24} className="px-2">

            <Form
              form={form}
              name="basicInformation"
              layout="vertical"
              initialValues={
                {
                  tipo: 0, genero: 0, gremio: 0, candidato: 0, lider: 0
                }
              }
              onFinish={onFinish}
            >

              <Row gutter={16}>


                <Col className="gutter-row d-none" xs={24} sm={4}>
                  <Form.Item label="Tipo" name="tipo" >
                    <Select  >
                      {tipos.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>



                <Col className="gutter-row d-none" xs={24} sm={4}>
                  <Form.Item label="Tipo de candidato" name="candidato" >
                    <Select  >
                      {tipos_candidato.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>


                <Col className="gutter-row d-none" xs={24} sm={4}>
                  <Form.Item label="Gremio" name="gremio" >
                    <Select  >
                      {gremios.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>



                <Col className="gutter-row d-none" xs={24} sm={4}>
                  <Form.Item label="Genero" name="genero" >
                    <Select  >
                      {generos.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} sm={4}>
                  <Form.Item label="Nombre" name="nombre" >
                    <Input
                      prefix={<FileSearchOutlined className="text-primary" />}
                      placeholder={"Nombre"}
                      onChange={e => searchByName(e)}
                    />
                  </Form.Item>
                </Col>


                <Col className="gutter-row d-none" xs={24} sm={4}>
                  <Form.Item label="Lider" name="lider" >
                    <Select  >
                      {lideres.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>



                <Col className="gutter-row" xs={12} sm={4}  >
                  <Form.Item
                    label=" "
                  >
                    <Spin spinning={loading}>
                      <Button className="w-100" type="primary" htmlType="submit">
                        Buscar
                      </Button>

                    </Spin>
                  </Form.Item>
                </Col>



              </Row>


            </Form>

          </Col>




          {
            recordList.map((item) => (
              <Col xs={24} sm={12} >
                <Card className="m-2" style={{ overflow: 'auto' }} >

                  <Row>

                    <Col xs={24} sm={5} className=" p-1 text-center" style={{ minHeight: '200px' }} >
                      <div >
                        <img
                          src={`${URL_BASE}uploads/${item.id}.jpg?v=${Date.now()}`}
                          alt="Foto"
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                          }}
                        />


                      </div>

                      <table>


                      </table>
                    </Col>

                    <Col span={11} className=" p-2" style={{ fontSize: '12px' }} >
                      <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#5575cc' }}>{item.nombre}</label><br />
                      <label style={{ fontWeight: 'bold' }}>Cédula:</label> {item.cedula}<br />
                      <label style={{ fontWeight: 'bold' }}>Municipio:</label> {item.municipio}<br />
                      <label style={{ fontWeight: 'bold' }}>Celular:</label> {item.celular}<br />
                      <label style={{ fontWeight: 'bold' }}>Dirección:</label> {item.direccion}<br />
                      <label style={{ fontWeight: 'bold' }}>Barrio:</label> {item.barrio}<br />
                      <label style={{ fontWeight: 'bold' }}>Profesion:</label> {item.profesion}<br />
                      <label style={{ fontWeight: 'bold' }}>Entidad:</label> {item.entidad}<br />
                      <label style={{ fontWeight: 'bold' }}>Tipo:</label> {item.tipo}<br />
                      <label style={{ fontWeight: 'bold' }}>Lider:</label> {item.lider}<br />
                      <label style={{ fontWeight: 'bold' }}>Compromiso:</label> {item.compromiso}<br />
                      <div className={item.contador_hijos ? "" : "d-none"} ><label style={{ fontWeight: 'bold' }}>Sub-lideres:</label> {item.contador_hijos}<br />
                        <label style={{ fontWeight: 'bold' }}>Compromiso sub-lideres:</label> {item.compromiso_hijos}<br />
                      </div>

                      <div className={item.contador_hijos ? "d-none" : ""} ><label style={{ fontWeight: 'bold' }}> </label><br />
                        <label style={{ fontWeight: 'bold' }}> </label>  <br />
                      </div>

                    </Col>

                    <Col span={8} className=" p-2 text-center" style={{ fontSize: '12px' }} >
                      <table className={item.mesa_votacion ? "table-bordered  w-100 ms-1 mt-2" : "d-none"} >
                        <thead className="bg-primary" >
                          <tr  >
                            <th >Puesto de Votación</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>{item.departamento_votacion}</td></tr>
                          <tr><td>{item.municipio_votacion}</td></tr>
                          <tr><td>{item.puesto_votacion}</td></tr>
                          <tr><td>{item.mesa_votacion}</td></tr>
                          <tr><td>{item.direccion_votacion}</td></tr>
                        </tbody>
                      </table>
                    </Col>

                    <Divider ></Divider>

                    <Col span={24} className="text-center" style={{ fontSize: '12px' }} >
                      <img  className="ms-1 d-none" src={editar} style={{ height: '40px', width: '40px' }}  ></img>
                      <img className="ms-1 d-none" src={list} style={{ height: '40px', width: '40px' }}  ></img>


                      <a className={item.celular?"":"d-none"}  target="_blank" href={`tel:${item.celular}`} >                      
                        <img className="ms-1" src={phone} style={{ height: '40px', width: '40px' }}  ></img>
                      </a>


                      <a className={item.celular?"":"d-none"}  target="_blank" href={`https://api.whatsapp.com/send?phone=+57${item.celular}`} >                      
                        <img className="ms-1" src={whatsapp} style={{ height: '40px', width: '40px' }}  ></img>
                      </a>

                      <a className={item.facebook?"":"d-none"} href={item.facebook} target="_blank" >
                        <img className="ms-1" src={facebook} style={{ height: '40px', width: '40px' }}  ></img>
                      </a>

                      <a className={item.instagram?"":"d-none"} href={item.instagram} target="_blank" >
                        <img className="ms-1" src={instagram} style={{ height: '40px', width: '40px' }}  ></img>
                      </a>

                      <a className={item.twitter?"":"d-none"} href={item.twitter} target="_blank" >
                        <img className="ms-1" src={twitter} style={{ height: '40px', width: '40px' }}  ></img>
                      </a>

                      
                        <Link to={"../friends/update/"+item.id}  className="" >
                        <img className="ms-1" src={editar} style={{ height: '40px', width: '40px' }}  ></img>
                        </Link>

                    </Col>

                  </Row>


                </Card>
              </Col>
            ))
          }


        </Row>
      </div>
    </div>
  );
};
export default CardAmigos;
