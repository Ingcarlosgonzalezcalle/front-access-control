import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Col, Modal, Row, Form, Button } from "antd";


// Fix del ícono
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function AmigosMunicipio() {


    const [formActivity] = Form.useForm();
    const [departamentos, setDepartamentos] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const createNumberIcon = (number) =>
        L.divIcon({
            html: `<div class="marker-number">${number}</div>`,
            className: "custom-marker",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });



    const showModal = () => {
        setOpen(true);
    };


    const handleOk = () => {
        setOpen(true);
        setLoading(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };



    useEffect(() => {
        axios
            .get("http://localhost:8020/api/map/amigos-municipio") // Cambia la URL
            .then((res) => setDepartamentos(res.data.data))
            .catch((err) => console.log(err));
    }, []);

    const colombiaCenter = [4.570868, -74.297333];

    return (
        <div className="card p-2">
        <div className="row">

            <div className="col-12 col-sm-102">

                <MapContainer
                    center={colombiaCenter}
                    zoom={6}
                    style={{ width: "100%", height: "600px" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {departamentos.map((item) => (
                        <Marker
                            key={item.id}
                            position={[item.latitud, item.longitud]}
                            icon={createNumberIcon(item.total_amigos)}

                        >
                            <Popup>
                                <strong>{item.nombre}</strong><br />
                                Amigos: {item.total_amigos}<br></br>
                                <input
                                    type="button"
                                    className="w-100 mt-2 form-control bg-info text-white"
                                    value="Ver Listado"
                                    onClick={() => handleOk()}
                                />
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

            </div>
            <div className="col-12 col-sm-2">

                <Modal
                    open={open}
                    title="Listado de amigos"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >

                    <Form
                        key={10}
                        form={formActivity}
                        name="basicInformation"
                        layout="vertical"
                        initialValues={{}}
                        onFinish={handleCancel}
                    >

                        <Row gutter={16}>

                        </Row>
                    </Form>
                </Modal>

            </div>


        </div>
        </div>
    );
}
