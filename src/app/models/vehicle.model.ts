export interface Vehicle {
    id?: number;
    placa: string;
    marca: string;
    fecFabricacion: string;
    color: 'blanco' | 'negro' | 'azul' | '';
    costo: number|null;
    activo: boolean;
    oculto: boolean;
    fotoUrl: string;
}
