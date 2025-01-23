export const STATUS_OPTIONS = [
  { text: "Disponible", value: "disponible" },
  { text: "En Mantenimiento", value: "en_mantenimiento" },
  { text: "En Servicio", value: "en_servicio" },
];

export const VEHICLE_TABLE_HEADERS = [
  {
    title: "Id",
    key: "_id",
    sortable: false,
    width: "10%",
  },
  {
    title: "Marca",
    key: "brand",
    sortable: true,
    width: "10%",
  },
  {
    title: "Modelo",
    key: "model",
    sortable: true,
    width: "10%",
  },
  {
    title: "Año",
    key: "year",
    sortable: true,
    align: "center",
    width: "10%",
  },
  {
    title: "Estado",
    key: "status",
    sortable: true,
    width: "10%",
  },
  {
    title: "Creado",
    key: "createdAt",
    sortable: true,
    width: "15%",
  },
  {
    title: "Actualizado",
    key: "updatedAt",
    sortable: true,
    width: "15%",
  },
  {
    title: "Creador",
    key: "createdBy",
    sortable: true,
    width: "10%",
  },
  {
    title: "Actualizado Por",
    key: "updatedBy",
    sortable: true,
    width: "10%",
  },
  {
    title: "Acciones",
    key: "actions",
    sortable: false,
    align: "end",
    width: "10%",
  },
];

export const FILTER_STATUS_OPTIONS = [
  { text: "Todos", value: "" },
  { text: "Disponible", value: "disponible" },
  { text: "En Mantenimiento", value: "en_mantenimiento" },
  { text: "En Servicio", value: "en_servicio" },
];

export const CHIPS_STATUS_CONFIG = {
  disponible: {
    color: "success",
    text: "Disponible",
  },
  en_mantenimiento: {
    color: "warning",
    text: "En Mantenimiento",
  },
  en_servicio: {
    color: "info",
    text: "En Servicio",
  },
};
