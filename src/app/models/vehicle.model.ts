export interface Vehicle {
    placa: string;
    marca: string;
    fecFabricacion: string;
    color: 'blanco' | 'negro' | 'azul' | '';
    costo: number;
    activo: boolean;
}
