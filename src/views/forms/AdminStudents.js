import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import userService from "../../services/user-service";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Form, Pagination, Spin, Table, Button, Input, Divider } from "antd";
import { ToastContainer, toast } from 'react-toastify';

import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import moment from "moment";
import { differenceInYears } from "date-fns";

const AdminStudents = () => {



  registerLocale("es", es);
  const start_date = moment().subtract(1, 'day').startOf('day').toDate();
  const end_date = moment().subtract(1, 'day').endOf('day').toDate();
  const [startDate, setStartDate] = useState(start_date);
  const [age, setAge] = useState(0);


  let navigate = useNavigate();
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showSave, setShowSave] = useState(true);


  ////TODO ESTO ES DE PAGINACION/////////
  const [findName, setFindName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const educationalLevelList = [
    { id: "NINGUNO", name: "Ninguno" },
    { id: "PRIMARIA", name: "Primaria" },
    { id: "BACHILLER", name: "Bachiller" },
    { id: "TECNICO", name: "Tecnico" },
    { id: "TECNOLOGO", name: "Tecnologo" },
    { id: "PROFESIONAL", name: "Profesional" },
    { id: "POSTGRADO", name: "Postgrado" },
  ];



  const documentTypeList = [
    { id: "CEDULA CIUDADANIA", name: "Cédula ciudadania" },
    { id: "CEDULA EXTRANGERIA", name: "Cedula extrangería" },
    { id: "PASAPORTE", name: "Pasaporte" },
    { id: "PERMISO DE PERMANENCIA", name: "Permiso de permanencia" },
    { id: "REGISTRO CIVIL", name: "Registro civil" },
    { id: "TARGETA DE PERMANENCIA", name: "Targeta de identidad" },
    { id: "PERMISO TEMPORAL", name: "Permiso temporal" },
  ];


  const laborSectorList = [
    { id: "NO DEFINIDO", name: "No definido" },
    { id: "AGROPECUARIO", name: "Agropecuario" },
    { id: "COMERCIO", name: "Pasaporte" },
    { id: "SERVICIOS", name: "Servicios" },
    { id: "COMUNICACIONES", name: "Comunicaciones" },
    { id: "CONSTRUCCION", name: "construcción" },
    { id: "EDUCACION", name: "Educación" },
    { id: "FINANCIERO", name: "Financiero" },
    { id: "INDUSTRIAL", name: "Industrial" },
    { id: "MINERO ENERGETICO", name: "Minero energetico" },
    { id: "TRANSPORTE", name: "Transporte" },
    { id: "ELECTRICO", name: "Electrico" },
    { id: "HIDROCARBUROS", name: "Hidrocarburos" },
    { id: "SALUD", name: "Salud" },
  ];


  const optionsState = [
    { id: true, name: "ACTIVO" },
    { id: false, name: "INACTIVO" },
  ];

  const genderList = [
    { id: "MASCULINO", name: "Masculino" },
    { id: "FEMENINO", name: "Femenino" },
  ];

  const areaList = [
    { id: "OPERATIVA", name: "Operativa" },
    { id: "ADMINISTRATIVA", name: "Administrativa" },
  ];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();


  const searchByName = (e) => {
    const name = e.target.value
    setFindName(name)
  }

  const capitalizeWords = (e) => {
    const role = getValues("role");
    console.log(role)
    if (role == "ADMINISTRADOR")
      return;
    let value = e.target.value;
    value = value
      .split(' ') // Divide el texto en palabras
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitaliza la primera letra de cada palabra
      )
      .join(' ');
    setValue("name", value);
  };

  const toUpperCaseCity = (e) => {
    let value = e.target.value;
    value = value.toUpperCase()
    setValue("city", value);
  };


  const toLowerCase = (e) => {
    let value = e.target.value;
    value = value.toLowerCase()
    setValue("info", value);
  };


  ////FUNCIONES QUE USAN EL SERVICIO FARMSERVICE
  ////FUNCIONES QUE USAN EL SERVICIO FARMSERVICE
  const getListUsers = async () => {
    setLoading(true)
    const listado = await userService.getList(findName);
    if (listado)
      setList(listado);
    setTotal(listado.lenght)
    setLoading(false)
  };

  const updateUser = async () => {
    const id = getValues("id");
    const name = getValues("name");
    const username = getValues("username");
    const identification = getValues("identification");
    const role = getValues("role");
    const password = getValues("passwordForm");
    const state = getValues("state");
    const data = { name, username, password, id, role, identification, state };
    const success = await userService.update(data);
    if (success) {
      reset();
      getListUsers();
      setShowEdit(false);
      setShowSave(true);
      toast('Realizado.', { autoClose: 1000 });
    }
  };

  const customSubmit = async (dataForm) => {

    const id = "";
    const name = getValues("name");
    const username = getValues("username");
    const identification = getValues("identification");
    const role = getValues("role");
    const password = getValues("passwordForm");
    const state = getValues("state");
    const data = { name, username, password, id, role, identification, state };
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

  const getUser = async (userId) => {
    const user = await userService.getUser(userId);
    if (user) {
      setValue("id", user._id);
      setValue("username", user.username);
      setValue("name", user.name);
      setValue("identification", user.identification);
      setValue("password", "");
      setValue("state", user.state);
      setValue("role", user.role);
      setShowEdit(true);
      setShowSave(false);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }
  };



  useEffect(() => {
    getListUsers();
    setValue("username", "")
    setValue("identification", "")
    setValue("passwordForm", "")
    reset();
  }, [findName]);


  return (
    <div className="row">
      <ToastContainer />

      <div className="col-12 col-sm-7">

        <div className="card p-4">
          <form className="form-react"
            onSubmit={handleSubmit(customSubmit)}

          >
            <div className="row">
              <div className="card-title">
                <h4 className="text-secondary" >Datos del estudiante</h4>
              </div>


              <div className=" col-12 d-none">
                <label>Id usuario</label>
                <input
                  readOnly={true}
                  type="text"
                  className="form-control bg-light"
                  {...register("id")}
                />
              </div>



              <div className=" col-4">
                <label>Tipo de documento</label>
                <select className="form-control" {...register("state")}>
                  {documentTypeList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>



              <div className=" col-4">
                <label>Identificacion</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("identification")}
                />
              </div>



              <div className=" col-4">
                <label>Sector laboral</label>
                <select className="form-control" {...register("state")}>
                  {laborSectorList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>




              <div className=" col-8">
                <label>Nombre completo</label>
                <input
                  type="text"
                  onKeyUp={capitalizeWords}
                  className="form-control"
                  {...register("name", { required: true, minLength: 3 })}
                />
                {errors.name?.type === "required" && (
                  <small className="text-danger">Campo requerido</small>
                )}
                {errors.name?.type === "minLength" && (
                  <small className="text-danger">Minimo 10 caracteres</small>
                )}
              </div>




              <div className=" col-4">
                <label>Ciudad</label>
                <input
                  type="text"
                  onKeyUp={toUpperCaseCity}
                  className="form-control"
                  {...register("city", { required: true, minLength: 3 })}
                />
              </div>




              <div className=" col-4">
                <label>Nivel educativo</label>
                <select className="form-control" {...register("educationalLevel")}>
                  {educationalLevelList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="col-4">
                <label>Fecha de nacimiento</label>
                <Controller
                  control={control}
                  name="birthDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      locale="es"
                      dateFormat="yyyy-MM-dd"
                      className="form-control text-secondary"
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        if (date) {
                          const years = differenceInYears(new Date(), date);
                          setValue("age",years)
                        } else {
                          setValue("age",0)
                        }
                      }}
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                    />
                  )}
                />
              </div>




              <div className=" col-4">
                <label>Ocupación</label>
                <input
                  type="text"
                  onKeyUp={toUpperCaseCity}
                  className="form-control"
                  {...register("ocupation", { required: true, minLength: 3 })}
                />
              </div>




              <div className=" col-4">
                <label>Celular</label>
                <input
                  type="text"
                  onKeyUp={toUpperCaseCity}
                  className="form-control"
                  {...register("phone", { required: true, minLength: 10 })}
                />
              </div>


              <div className=" col-4">
                <label>Genero</label>
                <select className="form-control" {...register("gender")}>
                  {genderList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className=" col-4">
                <label>Area</label>
                <select className="form-control" {...register("area")}>
                  {areaList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>




              <div className=" col-4">
                <label>Edad</label>
                <input
                  type="number"
                  readOnly={true}

                  onKeyUp={toUpperCaseCity}
                  className="form-control bg-light"
                  {...register("age", { required: true })}
                />
              </div>




              <div className=" col-4">
                <label>Estado</label>
                <select className="form-control" {...register("state")}>
                  {optionsState.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>



              <div className=" col-4">
                <label>Información</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("info")}
                />

              </div>


              <div className={showEdit ? " col-6" : "d-none"}>
                <label>&nbsp; </label>
                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={() => updateUser()}
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


      <div className="col-12 col-sm-5">
        <div className="card p-4">
          <div className="row">


            <div className="col-4">
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
        pageSizeOptions={["10", "20", "50"]}
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
                          <th>Identificación</th>
                          <th>Nombre</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {


                          if (item.username == "superadmin") return "";

                          return (
                            <tr key={index} className={item.state ? "" : "table-secondary"}  >
                              <td>{item.identification}</td>
                              <td>{item.name}</td>
                              <td style={{ width: "30px" }}>
                                <a
                                  onClick={() => getUser(item._id)}>
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

export default AdminStudents;
