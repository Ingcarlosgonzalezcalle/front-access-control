import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import groupService from "../../services/group-service";
import courseService from "../../services/course-service";
import trainerService from "../../services/trainer-service";
import supervisorService from "../../services/supervisor-service";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Form, Pagination, Spin, Table, Button, Input, Divider } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import { registerLocale, setDefaultLocale } from "react-datepicker";

import moment from "moment";
import { CButton } from "@coreui/react";


const AdminGroups = () => {


  registerLocale("es", es);
  const start_date = moment().subtract(1, 'day').startOf('day').toDate();
  const end_date = moment().subtract(1, 'day').endOf('day').toDate();
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const city = "Chía Cundinamarca"


  let navigate = useNavigate();
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showSave, setShowSave] = useState(true);


  const [courseList, setCourseList] = useState([]);
  const [trainerList, setTrainerList] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  ////TODO ESTO ES DE PAGINACION/////////
  const [findName, setFindName] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };




  const optionsState = [
    { id: "ABIERTO", name: "ABIERTO" },
    { id: "CERRADO", name: "CERRADO" },
    { id: "REPORTADO", name: "REPORTADO" },
  ];

  const typeList = [
    { id: "BASICO", name: "BASICO" },
    { id: "ALTURAS", name: "ALTURAS" }
  ];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm()


  const searchByName = (e) => {
    const name = e.target.value
    setFindName(name)
  }

  const toUpperCaseResolution = (e) => {
    let value = e.target.value;
    value = value.toUpperCase()
    setValue("resolution", value);
  };



  ////FUNCIONES QUE USAN EL SERVICIO FARMSERVICE
  ////FUNCIONES QUE USAN EL SERVICIO FARMSERVICE
  const getListGroups = async () => {
    setLoading(true)
    const listado = await groupService.getList(findName);
    if (listado)
      setList(listado);
    setTotal(listado.lenght)
    setLoading(false)
  };

  const updateCourse = async () => {
    const id = getValues("id");
    const courseId = getValues("course");
    const courseName = getNameSelect(courseList, courseId)
    const trainerId = getValues("trainer");
    const trainerName = getNameSelect(trainerList, trainerId)
    const supervisorId = getValues("supervisor");
    const supervisorName = getNameSelect(supervisorList, supervisorId)
    const quota = getValues("quota");
    const balance = getValues("balance");
    const startDate = getValues("startDate");
    const endDate = getValues("endDate");
    const graduationDate = getValues("graduationDate");
    const description = getValues("description");
    const status = getValues("status");
    const data = { id, courseId, courseName, trainerId, trainerName, supervisorId, supervisorName, quota, balance, startDate, endDate, graduationDate, description, status };
    const success = await groupService.update(data);
    if (success) {
      reset();
      getListGroups();
      setShowEdit(false);
      setShowSave(true);      
      setValue("city", city)    
      toast('Realizado.', { autoClose: 1000 });
    }
  };

  const customSubmit = async (dataForm) => {
    const id = ""
    const courseId = getValues("course");
    const courseName = getNameSelect(courseList, courseId)
    const trainerId = getValues("trainer");
    const trainerName = getNameSelect(trainerList, trainerId)
    const supervisorId = getValues("supervisor");
    const supervisorName = getNameSelect(supervisorList, supervisorId)
    const quota = getValues("quota");
    const balance = getValues("balance");
    const start_date = getValues("startDate");
    const end_date = getValues("endDate");
    const graduation_date = getValues("graduationDate");
    const description = getValues("description");
    const status = getValues("status");

    const start = moment(start_date).startOf("day").format('YYYY-MM-DD');
    const end = moment(end_date).endOf("day").format('YYYY-MM-DD');
    const graduation = moment(graduation_date).endOf("day").format('YYYY-MM-DD');

    const data = { id, courseId, courseName, trainerId, trainerName, supervisorId, supervisorName,  quota, balance, startDate: start, endDate: end, graduationDate: graduation, description, status };


    const response = await groupService.insert(data);
    if (response.success) {
      reset();
      getListGroups();      
      setValue("city", city)    
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
    setValue("city", city)    
  };

  const getGroup = async (recordId) => {
    const record = await groupService.get(recordId);
    if (record) {
      setValue("id", record._id);
      setValue("course", record.courseId);
      setValue("trainer", record.trainerId);
      setValue("supervisor", record.supervisorId);
      setValue("balance", record.balance);
      setValue("quota", record.quota);
      setValue("startDate", record.startDate.split("T")[0]);
      setValue("endDate", record.endDate.split("T")[0]);
      setValue("graduationDate", record.graduationDate.split("T")[0]);
      setValue("description", record.description);
      setValue("status", record.status);
      setShowEdit(true);
      setShowSave(false);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }
  };




  const getDaysCourse = (e) => {
    const value = e.target.value
    const item = courseList.find(a => a.id == value)
    const days = item.days
    const start_date = getValues("startDate");
    const end_date = moment(start_date).add(days, 'd').endOf("day").toDate();
    setValue("endDate", end_date)
    setValue("graduationDate", end_date)
  }

  const getDaysCourseFromDate = () => {
    const course = getValues("course");
    const item = courseList.find(a => a.id == course)
    const days = item.days
    const start_date = getValues("startDate");
    const end_date = moment(start_date).add(days, 'd').endOf("day").toDate();
    setValue("endDate", end_date)
    setValue("graduationDate", end_date)
  }


  const getNameSelect = (list, id) => {
    console.log(list)
    console.log(id)
    const name = list.find(a => a.id == id)
    return name.name
  }


  const getCourseList = async () => {
    let listado = await courseService.getList("");
    if (listado) {
      listado.push({ id: 0, name: "-ESCOJA-" });
      const sortedItems = listado.sort((a, b) => a.name.localeCompare(b.name));
      setCourseList(sortedItems);
    }
  };

  const getTrainerList = async () => {
    let listado = await trainerService.getList("");
    if (listado) {
      listado.push({ id: 0, name: "-ESCOJA-" });
      const sortedItems = listado.sort((a, b) => a.name.localeCompare(b.name));
      setTrainerList(sortedItems);
    }
  };

  const getSupervisorList = async () => {
    let listado = await supervisorService.getList("");
    if (listado) {
      listado.push({ id: 0, name: "-ESCOJA-" });
      const sortedItems = listado.sort((a, b) => a.name.localeCompare(b.name));
      setSupervisorList(sortedItems);
    }
  };

  const genertateDescription = () => {


    const start_date = getValues("startDate");
    const end_date = getValues("endDate");
    const graduation_date = getValues("graduationDate");
    const city = getValues("city");
    

    const startDay = moment(start_date).startOf("day").format('DD');
    const startYear = moment(start_date).startOf("day").format('YYYY');
    const endDay = moment(end_date).endOf("day").format('DD');
    const graduationDay = moment(graduation_date).endOf("day").format('DD');
    const graduationYear = moment(graduation_date).endOf("day").format('YYYY');


    let description = `Curso realizado en ${city} el ${startDay} septiembre ${startYear}, se expide en  ${city}  el ${graduationDay} septiembre ${graduationYear}`
    setValue("description", description)
  }


  useEffect(() => {
    getCourseList()
    getTrainerList()
    getSupervisorList()
    getListGroups();
    reset();
    setValue("city", city)    
  }, [findName]);


  return (
    <div className="row">
      <ToastContainer />

      <div className="col-12 col-sm-6">

        <div className="card p-4">
          <form className="form-react"
            onSubmit={handleSubmit(customSubmit)}

          >
            <div className="row">
              <div className="card-title">
                <h5 className="text-secondary" >Datos del grupo</h5>
              </div>


              <div className=" col-12 d-none">
                <label>Id grupo</label>
                <input
                  readOnly={true}
                  type="text"
                  className="form-control bg-light"
                  {...register("id")}
                />
              </div>


              <div className=" col-12">
                <label>Curso</label>
                <select className="form-control" {...register("course")} onChange={getDaysCourse}>
                  {courseList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className=" col-6">
                <label>Entrenador</label>
                <select className="form-control" {...register("trainer")}>
                  {trainerList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className=" col-6">
                <label>Supervisor</label>
                <select className="form-control" {...register("supervisor")}>
                  {supervisorList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

 <div className=" col-6 col-sm-4">
                <label>Inicio</label>
                <Controller
                  control={control}
                  name="startDate"
                  defaultValue={startDate}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      locale="es"
                      dateFormat="yyyy-MM-dd"
                      className="form-control text-secondary"
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        getDaysCourseFromDate()
                      }}
                    />
                  )}
                />
              </div>


              <div className=" col-6 col-sm-4">
                <label>Fin</label>
                <Controller
                  control={control}
                  name="endDate"
                  defaultValue={startDate}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      locale="es"
                      dateFormat="yyyy-MM-dd"
                      className="form-control text-secondary"
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        const endOfMonth = moment(date).endOf("month").toDate();
                        setValue("endDate", endOfMonth);
                      }}
                    />
                  )}
                />
              </div>


              <div className=" col-6 col-sm-4">
                <label>Grado</label>
                <Controller
                  control={control}
                  name="graduationDate"
                  defaultValue={startDate}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      locale="es"
                      dateFormat="yyyy-MM-dd"
                      className="form-control text-secondary"
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        const endOfMonth = moment(date).endOf("month").toDate();
                        setValue("endDate", endOfMonth);
                      }}
                    />
                  )}
                />
              </div>



              <div className=" col-6 col-sm-4">
                <label>Estado</label>
                <select className="form-control" {...register("status")}>
                  {optionsState.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>




              <div className=" col-6 col-sm-4">
                <label>Cupo</label>
                <input
                  type="number"
                  autoComplete="off"
                  onKeyUp={toUpperCaseResolution}
                  className="form-control"
                  {...register("quota")}
                />
              </div>





              <div className=" col-6 col-sm-4">
                <label>Saldo</label>
                <input
                  type="number"
                  autoComplete="off"
                  onKeyUp={toUpperCaseResolution}
                  className="form-control"
                  {...register("balance")}
                />
              </div>

             


              <div className=" col-8">
                <label>Municipio descripción</label>
                <input
                  type="text"
                  autoComplete="off"
                  onKeyUp={toUpperCaseResolution}
                  className="form-control"
                  {...register("city")}
                />
              </div>

              <div className=" col-4">
                <label>&nbsp; </label><br></br>
                <CButton color="primary" variant="outline"  className="form-control" size="sm" onClick={genertateDescription}  >Generar descripción</CButton>
              </div>



              <div className=" col-12 mt-3">
                <label>descripción </label>
                <textarea
                  rows={2}
                  type="text"
                  className="form-control"
                  {...register("description", { required: true, minLength: 3 })}
                />
              </div>





              <div className={showEdit ? " col-6" : "d-none"}>
                <label>&nbsp; </label>
                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={() => updateCourse()}
                >
                  <i className="bi bi-save fa-lg" /> Editar
                </button>
              </div>

              <div className={showSave ? " col-6" : "d-none"}>
                <label>&nbsp; </label>
                <button className="btn btn-primary w-100" type="submit">
                  <i className="bi bi-save fa-lg m-2" /> Guardar
                </button>
              </div>

              <div className=" col-6">
                <label>&nbsp; </label>
                <button
                  className="btn btn-secondary w-100"
                  type="button"
                  onClick={() => cancelar()}
                >
                  <i className="bi bi-x-square fa-lg m-2" /> Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>


      <div className="col-12 col-sm-6">
        <div className="card p-4">
          <div className="row">


            <div className="col-6 col-sm-4">
              <Input
                prefix={<SearchOutlined className="text-primary" />}
                placeholder={"Nombre"}
                onChange={e => searchByName(e)}
              />
            </div>


            <div className="col-8">
              <Pagination
                className="text-primary "
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                pageSizeOptions={["5", "10", "20", "50"]}
                showTotal={(total) => `Total ${total} registros`}
                showSizeChanger
                onShowSizeChange={(current, size) => handlePageChange(1, size)}
              />
            </div>

            <div className="col-12 mt-3">

              <Spin spinning={loading}>
                <div className="bdr">
                  <div className="table-responsive">
                    <table className="table" style={{ fontSize: '14px' }}>
                      <thead className="table-info">
                        <tr>
                          <th>Consecutivo</th>
                          <th>Curso</th>
                          <th>Cupo</th>
                          <th>Saldo</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {



                          return (
                            <tr key={index} className={item.status ? "" : "table-secondary"}  >
                              <td>{item.consecutive}</td>
                              <td>{item.courseName}</td>
                              <td>{item.quota}</td>
                              <td>{item.balance}</td>
                              <td style={{ width: "30px" }}>
                                <a
                                  onClick={() => getGroup(item._id)}>
                                  <i className="bi bi-pencil-square m-1 h6 text-primary" />
                                </a>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminGroups;
