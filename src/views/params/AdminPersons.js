import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import personService from "../../services/person-service.js";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Form, Pagination, Spin, Table, Button, Input, Divider } from "antd";
import { ToastContainer, toast } from 'react-toastify';

const AdminPersons = () => {
  let navigate = useNavigate();
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showSave, setShowSave] = useState(true);


  ////TODO ESTO ES DE PAGINACION/////////
  const [findName, setFindName] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };




  const optionsState = [
    { id: true, name: "ACTIVO" },
    { id: false, name: "INACTIVO" },
  ];

  const typeList = [
    { id: "ESTUDIANTE", name: "ESTUDIANTE" },
    { id: "PROFESOR", name: "PROFESOR" },
    { id: "DIRECTOR", name: "DIRECTOR" },
    { id: "COORDINADOR", name: "COORDINADOR" },
    { id: "FUNCIONARIO", name: "FUNCIONARIO" },
    { id: "EXTERNO", name: "EXTERNO" },
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
    const type = getValues("type");
    console.log(type)
    if (type == "ADMINISTRADOR")
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



  const getListUsers = async () => {
    setLoading(true)
    const limit = 10
    const findName = ""
    const listado = await personService.list(page, limit, findName);
    if (listado)
      setList(listado.data);
    setTotal(listado.total)
    setLoading(false)
  };

  const update = async () => {
    const id = getValues("id");
    const name = getValues("name");
    const type = getValues("type");
    const identification = getValues("identification");
    const status = getValues("status");
    const data = { id, name,type,identification,status };
    const success = await personService.update(data);
    if (success) {
      reset();
      getListUsers();
      setShowEdit(false);
      setShowSave(true);
      toast('Realizado.', { autoClose: 1000 });
    }



  };





  const customSubmit = async (dataForm) => {

    const name = getValues("name");
    const type = getValues("type");
    const identification = getValues("identification");
    const status = getValues("status");
    const data = { name,type,identification,status };
    const response = await personService.insert(data);
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
    const user = await personService.get(userId);
    if (user) {
      setValue("id", user.id);
      setValue("name", user.name);
      setValue("identification", user.identification);
      setValue("type", user.type);
      setValue("status", user.status);
      setShowEdit(true);
      setShowSave(false);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }
  };



  useEffect(() => {
    getListUsers();
    setValue("usernameForm", "")
    setValue("identification", "")
    reset();
  }, [page, pageSize]);


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
                <h4 className="text-secondary" >Datos de la persona</h4>
              </div>


              <div className=" col-12 d-none">
                <label>Id persona</label>
                <input
                  readOnly={true}
                  type="text"
                  className="form-control bg-light"
                  {...register("id")}
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



              <div className=" col-12">
                <label>Identificación</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="form-control"
                  {...register("identification")}
                />
              </div>






              <div className=" col-12 col-sm-6">
                <label>Rol</label>
                <select className="form-control" {...register("type")}>
                  {typeList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className=" col-12 col-sm-6">
                <label>Estado</label>
                <select className="form-control" {...register("status")}>
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
                  onClick={() => update()}
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


      <div className="col-12 col-sm-8">
        <div className="card p-4">
          <div className="row">


            <div className="col-12 col-sm-3 ">
              <Input
                prefix={<SearchOutlined className="text-primary" />}
                placeholder={"Nombre"}
                onChange={e => searchByName(e)}
              />
            </div>


            <div className="col-12 col-sm-9">
              <Pagination
                className="text-primary"
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showTotal={(total) => `Total ${total} registros`}
                showSizeChanger={false}
                showLessItems={true}
              />
            </div>

            <div className="col-12 mt-4">

              <Spin spinning={loading}>
                <div className="bdr">
                  <div className="table-responsive">
                    <table className="table" style={{ fontSize: '14px' }}>
                      <thead className="table-info">
                        <tr>
                          <th>Identificación</th>
                          <th>Nombre</th>
                          <th>type</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {


                          //if (item.username == "superadmin") return "";

                          return (
                            <tr key={item.id}  >
                              <td>{item.identification}</td>
                              <td>{item.name}</td>
                              <td>{item.type}</td>
                              <td style={{ width: "30px" }}>
                                <a
                                  onClick={() => getUser(item.id)}>
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

export default AdminPersons;
