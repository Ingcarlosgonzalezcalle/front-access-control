import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import courseService from "../../services/course-service";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Form, Pagination, Spin, Table, Button, Input, Divider } from "antd";
import { ToastContainer, toast } from 'react-toastify';

const AdminCourses = () => {
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
  const getListCourses = async () => {
    setLoading(true)
    const listado = await courseService.getList(findName);
    if (listado)
      setList(listado);
    setTotal(listado.lenght)
    setLoading(false)
  };

  const updateCourse = async () => {
    const id = getValues("id");
    const name = getValues("name");
    const hours = getValues("hours");
    const days = getValues("days");
    const type = getValues("type");
    const status = getValues("status");
    const data = { id, name, hours, days, type, status };
    const success = await courseService.update(data);
    if (success) {
      reset();
      getListCourses();
      setShowEdit(false);
      setShowSave(true);
      toast('Realizado.', { autoClose: 1000 });
    }
  };

  const customSubmit = async (dataForm) => {

    const id = "";
    const name = getValues("name");
    const hours = getValues("hours");
    const days = getValues("days");
    const type = getValues("type");
    const status = getValues("status");
    const data = { id, name, hours, days, type, status };
    const response = await courseService.insert(data);
    if (response.success) {
      reset();
      getListCourses();
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

  const getCourse = async (recordId) => {
    const record = await courseService.get(recordId);
    if (record) {
      setValue("id", record._id);
      setValue("name", record.name);
      setValue("hours", record.hours);
      setValue("days", record.days);
      setValue("type", record.type);
      setValue("status", record.status);
      setShowEdit(true);
      setShowSave(false);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }
  };



  useEffect(() => {
    getListCourses();
    setValue("name", "")
    setValue("hours", "")
    setValue("days", "")
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
                <h4 className="text-secondary" >Datos del curso</h4>
              </div>


              <div className=" col-12 d-none">
                <label>Id curso</label>
                <input
                  readOnly={true}
                  type="text"
                  className="form-control bg-light"
                  {...register("id")}
                />
              </div>

              <div className=" col-12">
                <label>Nombre</label>
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



              <div className=" col-6">
                <label>Horas</label>
                <input
                  type="number"
                  autoComplete="off"
                  onKeyUp={toUpperCaseResolution}
                  className="form-control"
                  {...register("hours")}
                />
              </div>



              <div className=" col-6">
                <label>Dias</label>
                <input
                  type="number"
                  autoComplete="off"
                  onKeyUp={toUpperCaseResolution}
                  className="form-control"
                  {...register("days")}
                />
              </div>



              <div className=" col-12">
                <label>Tipo de curso</label>
                <select className="form-control" {...register("type")}>
                  {typeList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
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
                          <th>Tipo</th>
                          <th>Horas</th>
                          <th>Días</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {



                          return (
                            <tr key={index} className={item.status ? "" : "table-secondary"}  >
                              <td>{item.name}</td>
                              <td>{item.type}</td>
                              <td>{item.hours}</td>
                              <td>{item.days}</td>
                              <td style={{ width: "30px" }}>
                                <a
                                  onClick={() => getCourse(item._id)}>
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

export default AdminCourses;
