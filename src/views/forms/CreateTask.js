import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, Divider, Select, Form, Input, Modal, Spin } from 'antd';
import { DatePicker } from 'antd';
import { DeleteOutlined, ClockCircleOutlined, PlusSquareOutlined, CalendarOutlined, NumberOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import userService from "../../services/user-service";

export const InternalMovement = () => {

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();


  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showSave, setShowSave] = useState(true);

  const [startDate, setStartDate] = useState(dayjs());
  const [form] = Form.useForm();
  const [formActivity] = Form.useForm();
  const [movementId, setMovementId] = useState("")
  const [productId, setProductId] = useState(1)
  const [actualDays, setActualDays] = useState(0)
  const [actualBalance, setActualBalance] = useState(0)
  const [loading, setLoading] = useState(false)





  const [storeList, setStoreList] = useState([]);
  const [subTaskList, setSubTaskList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");



  const [detailsList, setDetailsList] = useState([])
  const [open, setOpen] = useState(false);




  const optionsState = [
    { id: true, name: "ACTIVO" },
    { id: false, name: "INACTIVO" },
  ];



  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };



  const clearForm = () => {
    form.resetFields()
    setDetailsList([])
  }


  const removeDetail = (id) => {
    const details = detailsList.filter((machine) => machine.id !== id);
    const newList = [...details];
    setDetailsList(newList)
    console.log(newList)
    message.info('Actividad de maquina removida');
  };






  const addSubTask = (values) => {

    let user = localStorage.getItem("user")
    let userId = "EXAMPLE-UUID"
    //const date = values.date ? values.date.toDate() : new Date();
    const date = values.date ? dayjs(values.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    const uuid = uuidv4()
    const newDetail = {
      id: uuid,
      movementId,
      date: date,
      description: values.description,
      userId,
      state: true
    };
    const updatedList = [...detailsList, newDetail];

    console.log(updatedList)
    setDetailsList(updatedList)
    setOpen(false);
  };



  const { TextArea } = Input;






  const onFinish = async (values) => {
    const id = movementId
    const storeId = values.store
    const type = 3
    const activityId = values.activity
    //const date = values.date// esta fecha no cambia
    const days = parseInt(values.days)
    const description = values.description
    const quantity = 0
    const balance = actualBalance
    const userId = localStorage.getItem("USER_ID")
    const state = true

    const cycles = parseInt(values.cycles)
    const bags = 0
    const presentation = 0
    const origin = storeId
    const destination = storeId


    let date = values.date ? values.date.toDate() : new Date();
    const now = new Date();

    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setSeconds(now.getSeconds());
    date.setMilliseconds(now.getMilliseconds());
    const originalQuantity = quantity

    const movement = { id, date, storeId, productId, quantity, originalQuantity, type, activityId, days, description, userId, state, balance, cycles, bags, presentation, origin, destination }

    const movementDetails = detailsList.map((detail) => ({
      ...detail,
      movementId,
      activityId,
      date
    }));
    const data = { movement, movementDetails }
    setLoading(true);

    setLoading(false);
    form.resetFields();
    setDetailsList([])
    console.log("se ingresó")
    const uuid = uuidv4()
    setMovementId(uuid)


  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };








  const customSubmit = async (dataForm) => {
    const id = "";
    const name = getValues("name");
    const username = getValues("username");
    const identification = getValues("identification");
    const role = getValues("role");
    const email = getValues("email");
    const phone = getValues("phone");
    const password = getValues("passwordForm");
    const state = getValues("state");
    const data = { name, username, password, id, role, identification, state, email, phone };
    const response = await userService.insert(data);
    if (response.success) {
      reset();
      getListUsers();
      toast('Realizado.', { autoClose: 1000 });
    }
    else {
      toast.error(response.message);
    }
  };

  const cancelar = async () => {
    setShowEdit(false);
    setShowSave(true);
    reset();
  };



  const getListUsers = async () => {
    const listado = await userService.getList("");
    if (listado)
      setList(listado);
  };




  useEffect(() => {
    const uuid = uuidv4()
    setMovementId(uuid)
    getListUsers()


  }, [])



  return (
    <><ToastContainer></ToastContainer>
      <div className=" row ">



        <Row gutter={[8, 8]}>

          <Col
            span={12}
          >

            <Card style={{ overflow: 'auto', height: '500px', backgroundColor: '#FFF' }} >

              <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={
                  {
                    date: startDate,
                    cycles: 1,
                  }
                }
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >



                <Row gutter={16}>





                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label="Titulo"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: 'Campo requerido',
                        },
                      ]}
                    >
                      <Input
                        onKeyUp={(e) => { }}
                      />
                    </Form.Item>
                  </Col>


                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label="Descripcion"
                      name="description"
                      rules={[{ required: true, message: 'descripción requerida' }]}
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                  </Col>









                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Fecha limite"
                      name="date"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        disabledDate={(current) => {
                          return current && current > dayjs().endOf("day");
                        }}
                      />
                    </Form.Item>
                  </Col>







                  <Col className="gutter-row" span={16}>
                    <Form.Item
                      label="Responsable:"
                      name="owner"
                      rules={[
                        {
                          required: true,
                          message: 'Seleccione un responsable',
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) => {
                        }}
                      >
                        {list.map((option) => {

                          if (option.role != "ADMINISTRADOR")
                            return (<Select.Option key={option._id} value={option.id}>{option.name}</Select.Option>)
                        }

                        )}
                      </Select>
                    </Form.Item>
                  </Col>



                  <Divider orientation="left"></Divider>

                  {/* <Col className={detailsList.length > 0 ? "gutter-row" : "d-none"} span={8}  > */}
                  <Col className="gutter-row" span={8}  >
                    <Form.Item
                      label=" "
                    >
                      <Spin spinning={loading}>
                        <Button className="w-100" type="primary" htmlType="submit">
                          Guardar Registro
                        </Button>

                      </Spin>

                    </Form.Item>
                  </Col>




                  <Col className="gutter-row" span={8} >
                    <Form.Item
                      label=" "
                    >
                      <Button className="w-100" danger onClick={clearForm} >
                        Cancelar
                      </Button>
                    </Form.Item>
                  </Col>





                </Row>


              </Form>



            </Card>

          </Col>



          <Col span={12} >


            <Card style={{ overflow: 'auto', height: '500px', backgroundColor: '#FFF' }} >
              <Button className="w-30 mb-3" color="primary" type="primary" variant="outlined" onClick={showModal} icon={<PlusSquareOutlined />} >
                Agregar subtareas
              </Button>

              {
                detailsList.map(item => {
                  return (
                    <div>
                      <Divider></Divider>
                      <Row gutter={4} key={item.id}>
                        <Col className="gutter-row" span={18}>
                          <b>Fecha:</b> {item.date}<br />
                          <b>Tarea:</b> {item.description}<br />

                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Button className="w-100" htmlType="button" danger icon={<DeleteOutlined />} onClick={() => removeDetail(item.id)} >
                            Eliminar
                          </Button>
                        </Col>

                      </Row>
                    </div>
                  )
                })

              }
            </Card>

          </Col>


          <Col span={12}>



            <Modal
              open={open}
              title="Actividad maquina"
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >

              <Form
                key={10}
                form={formActivity}
                name="basicInformation"
                layout="vertical"
                initialValues={
                  {
                  }
                }
                onFinish={addSubTask}
              >



                <Row gutter={16}>



                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Fecha"
                      name="date"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        disabledDate={(current) => {
                          return current && current > dayjs().endOf("day");
                        }}
                      />
                    </Form.Item>
                  </Col>






                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label="Descripción"
                      name="description"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                  </Col>


                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label=" "
                    >
                      <Button className="w-100" type="primary" htmlType="submit">
                        Agregar
                      </Button>
                    </Form.Item>
                  </Col>




                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label=" "
                    >
                      <Button className="w-100" danger onClick={() => setOpen(false)} >
                        Cancelar
                      </Button>
                    </Form.Item>
                  </Col>




                </Row>


              </Form>



















            </Modal>




          </Col>




        </Row>









      </div>

    </>
  )
}
export default InternalMovement;
