export interface Vehicle {
    placa: string;
    marca: string;
    fecFabricacion: Date;
    color: 'blanco' | 'negro' | 'azul';
    costo: number;
    activo: boolean;
}
