import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import userService from "../../services/user-service";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Form, Pagination, Spin, Table, Button, Input, Divider } from "antd";
import { ToastContainer, toast } from 'react-toastify';

const AdminUsers = () => {
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




  const optionsState = [
    { id: true, name: "ACTIVO" },
    { id: false, name: "INACTIVO" },
  ];

  const roleList = [
    { id: "FUNCIONARIO", name: "FUNCIONARIO" },
    { id: "SCRUM MASTER", name: "SCRUM MASTER" },
    { id: "ADMINISTRADOR", name: "ADMINISTRADOR" },
    { id: "CONSULTA", name: "CONSULTA" },
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

  const toCamelCase = (e) => {
    let value = e.target.value;
    value = value
      .replace(/(?:^\w|[A-Z]|\b\w|\s+|_|\-|\^)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    setValue("username", value);
  };

  const toLowerCase = (e) => {
    let value = e.target.value;
    value = value.toLowerCase()
    setValue("username", value);
  };


  const toLowerCaseMail = (e) => {
    let value = e.target.value;
    value = value.toLowerCase()
    setValue("email", value);
  };



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
    const email = getValues("email");
    const phone = getValues("phone");
    const data = { name, username, password, id, role, identification, state, email, phone };
    const success = await userService.update(data);
    if (success) {
      reset();
      getListUsers();
      setShowEdit(false);
      setShowSave(true);
      toast('Realizado.', { autoClose: 1000 });
    }


    //const successTwo = await userService.sendEvent(data);


  };



  const sendMail = async () => {
    const id = getValues("id");
    const name = getValues("name");
    const username = getValues("username");
    const identification = getValues("identification");
    const role = getValues("role");
    const password = getValues("passwordForm");
    const state = getValues("state");
    const email = getValues("email");
    const phone = getValues("phone");
    const data = { name, username, password, id, role, identification, state, email, phone };
    const successTwo = await userService.sendEvent(data);
  }

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
      setValue("email", user.email);
      setValue("phone", user.phone);
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

      <div className="col-12 col-sm-4">

        <div className="card p-4">
          <form className="form-react"
            onSubmit={handleSubmit(customSubmit)}

          >
            <div className="row">
              <div className="card-title">
                <h4 className="text-secondary" >Datos del usuario</h4>
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



              <div className=" col-12">
                <label>Identificacion</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("identification")}
                />
              </div>

              <div className=" col-12">
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



              <div className=" col-12 col-sm-6">
                <label>Username</label>
                <input
                  type="text"
                  autoComplete="off"
                  onKeyUp={toLowerCase}
                  className="form-control"
                  {...register("username")}
                />
              </div>

              <div className=" col-12 col-sm-6">
                <label>Telefono</label>
                <input
                  type="number"
                  autoComplete="off"
                  className="form-control"
                  {...register("phone")}
                />
              </div>




              <div className=" col-12">
                <label>Email</label>
                <input
                  type="text"
                  autoComplete="off"
                  onKeyUp={toLowerCaseMail}
                  className="form-control"
                  {...register("email")}
                />
              </div>



              <div className="col-12">
                <label>Password</label>
                <Controller
                  name="passwordForm"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      autoComplete="new-password" // Aquí va el atributo correcto
                      placeholder="Campo password"
                    />
                  )}
                />
                {errors.passwordForm?.type === "required" && (
                  <small className="text-danger">Campo requerido</small>
                )}
              </div>


              <div className=" col-12 col-sm-6">
                <label>Rol</label>
                <select className="form-control" {...register("role")}>
                  {roleList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className=" col-12 col-sm-6">
                <label>Estado</label>
                <select className="form-control" {...register("state")}>
                  {optionsState.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
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


              <div className=" col-12 ">
                <label>&nbsp; </label>
                <button
                  className="btn btn-info w-100"
                  type="button"
                  onClick={() => sendMail()}
                >
                  <i className="bi bi-x-square fa-lg m-2" /> Enviar correo
                </button>

              </div>


            </div>
          </form>
        </div>

      </div>


      <div className="col-12 col-sm-8">
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
                          <th>Nombre</th>
                          <th>Username</th>
                          <th>Identificación</th>
                          <th>Rol</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {


                          if (item.username == "superadmin") return "";

                          return (
                            <tr key={index} className={item.state ? "" : "table-secondary"}  >
                              <td>{item.name}</td>
                              <td>{item.username}</td>
                              <td>{item.identification}</td>
                              <td>{item.role}</td>
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

export default AdminUsers;
