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
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import reportService from "../../services/report-service";
import dayjs from "dayjs";


import { gremios, generos, tipos, tipos_candidato, lideres } from "../../config/listado-reportes";
import { FileSearchOutlined, SearchOutlined } from "@ant-design/icons";



export const ReportePuestos = () => {


  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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

  const downloadExcel = async () => {
    try {
      const tipo = form.getFieldValue("tipo")
      const genero = form.getFieldValue("genero")
      const gremio = form.getFieldValue("gremio")
      const candidato = form.getFieldValue("candidato")
      const params = { page, limit: pageSize, tipo, genero, gremio, candidato, findName }
      const response = await reportService.puestosReportExcel(params)

      // Crear un blob y un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'producto en inventario.xlsx'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };


  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Cedula",
      dataIndex: ["cedula"],
      key: ["cedula"],
    },
    {
      title: "Nombre",
      dataIndex: ["nombre"],
      key: ["nombre"],
    },
    {
      title: "Departamento",
      dataIndex: ["departamento_votacion"],
      key: ["departamento_votacion"],
    },
    {
      title: "Municipio",
      dataIndex: ["municipio_votacion"],
      key: ["municipio_votacion"],
    },
    {
      title: "Puesto",
      dataIndex: ["puesto_votacion"],
      key: ["puesto_votacion"],
    },
    {
      title: "Mesa",
      dataIndex: ["mesa_votacion"],
      key: ["mesa_votacion"],
    },
    {
      title: "Direccion",
      dataIndex: ["direccion_votacion"],
      key: ["direccion_votacion"],
    }
  ];


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
      const response = await reportService.puestossReport(params)
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
    <div className="card p-2">
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


                <Col className="gutter-row" xs={24} sm={4}>
                  <Form.Item label="Tipo" name="tipo" >
                    <Select  >
                      {tipos.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>



                <Col className="gutter-row" xs={24} sm={4}>
                  <Form.Item label="Tipo de candidato" name="candidato" >
                    <Select  >
                      {tipos_candidato.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>


                <Col className="gutter-row" xs={24} sm={4}>
                  <Form.Item label="Gremio" name="gremio" >
                    <Select  >
                      {gremios.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>



                <Col className="gutter-row" xs={24} sm={4}>
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


                <Col className="gutter-row" xs={24} sm={4}>
                  <Form.Item label="Lider" name="lider" >
                    <Select  >
                      {lideres.map((option) => (
                        <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>



                <Col className="gutter-row" style={{ marginTop: '-20px' }} xs={12} sm={4}  >
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


                <Col className="gutter-row" style={{ marginTop: '-20px' }} xs={12} sm={4}  >
                  <Form.Item
                    label=" "
                  >
                    <Spin spinning={loading}>
                      <Button className="w-100 bg-info text-white" htmlType="button" onClick={downloadExcel} >
                        Exportar
                      </Button>

                    </Spin>
                  </Form.Item>
                </Col>


              </Row>


            </Form>

          </Col>


          <Col span={24} >
            <Card style={{ overflow: 'auto', minHeight: '200px' }} >
              <Pagination
                className="text-secondary "
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                pageSizeOptions={["4", "8", "16", "50"]}
                showTotal={(total) => `${total} amigos`}
                showSizeChanger
                showLessItems
                onShowSizeChange={(current, size) => handlePageChange(1, size)}
              />
              <Spin spinning={loading}>
                <Table
                  className="table-success"
                  dataSource={recordList}
                  columns={columns}
                  pagination={false}
                  rowKey="_id" // Asume que cada documento tiene un campo _id
                />
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default ReportePuestos;
