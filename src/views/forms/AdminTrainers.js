import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import trainerService from "../../services/trainer-service";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Form, Pagination, Spin, Table, Button, Input, Divider } from "antd";
import { ToastContainer, toast } from 'react-toastify';

const AdminTrainers = () => {
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
    { id: "ASISTENTE", name: "ASISTENTE" },
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

 

 

  const toUpperCaseName = (e) => {
    let value = e.target.value;
    value = value.toUpperCase()
    setValue("name", value);
  };


  const toUpperCaseResolution = (e) => {
    let value = e.target.value;
    value = value.toUpperCase()
    setValue("resolution", value);
  };



  ////FUNCIONES QUE USAN EL SERVICIO FARMSERVICE
  ////FUNCIONES QUE USAN EL SERVICIO FARMSERVICE
  const getListTrainers = async () => {
    setLoading(true)
    const listado = await trainerService.getList(findName);
    if (listado)
      setList(listado);
    setTotal(listado.lenght)
    setLoading(false)
  };

  const updateTrainer = async () => {
    const id = getValues("id");
    const identification = getValues("identification");
    const name = getValues("name");
    const resolution = getValues("resolution");
    const status = getValues("status");
    const data = {id,identification,name,resolution,status};
    const success = await trainerService.update(data);
    if (success) {
      reset();
      getListTrainers();
      setShowEdit(false);
      setShowSave(true);
      toast('Realizado.', { autoClose: 1000 });
    }
  };

  const customSubmit = async (dataForm) => {

    const id = "";
    const name = getValues("name");
    const identification = getValues("identification");
    const resolution = getValues("resolution");
    const status = getValues("status");
    const data ={id,identification,name,resolution,status};
    const response = await trainerService.insert(data);
    if (response.success) {
      reset();
      getListTrainers();
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

  const getTrainer = async (recordId) => {
    const record = await trainerService.get(recordId);
    if (record) {
      setValue("id", record._id);
      setValue("identification", record.identification);
      setValue("name", record.name);
      setValue("resolution", record.resolution);
      setValue("status", record.status);
      setShowEdit(true);
      setShowSave(false);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }
  };



  useEffect(() => {
    getListTrainers();
    setValue("name", "")
    setValue("identification", "")
    setValue("resolution", "")
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
                <h4 className="text-secondary" >Datos del entrenador</h4>
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
                  onKeyUp={toUpperCaseName}
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
                <label>Resolución</label>
                <input
                  type="text"
                  autoComplete="off"
                  onKeyUp={toUpperCaseResolution}
                  className="form-control"
                  {...register("resolution")}
                />
              </div>



              <div className=" col-12">
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
                  onClick={() => updateTrainer()}
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
                    <table className="table" style={{fontSize:'14px'}}>
                      <thead className="table-info">
                        <tr>
                          <th>Nombre</th>
                          <th>Identificación</th>
                          <th>Resolution</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {



                          return(
                          <tr key={index} className={item.status ? "" : "table-secondary"}  >
                            <td>{item.name}</td>
                            <td>{item.identification}</td>
                            <td>{item.resolution}</td>
                            <td style={{ width: "30px" }}>                              
                                <a
                                  onClick={() => getTrainer(item._id)}>
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

export default AdminTrainers;
