import { z } from 'zod'

export const employeeRoles = [
  'WAITER',
  'COOK',
  'CASHIER',
  'MANAGER',
  'SUPERVISOR',
  'ADMIN',
] as const

export type EmployeeRole = (typeof employeeRoles)[number]

export const employeeRoleLabels: Record<EmployeeRole, string> = {
  WAITER: 'Mesero',
  COOK: 'Cocinero',
  CASHIER: 'Cajero',
  MANAGER: 'Gerente',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Administrador',
}

export const employeeSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  documentNumber: z.string(),
  role: z.enum(employeeRoles),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  hireDate: z.string(),
  isActive: z.boolean(),
  authUserId: z.string().nullable(),
})

export type Employee = z.infer<typeof employeeSchema>

export const employeeFormSchema = z.object({
  branchId: z.number('La sucursal es requerida.'),
  firstName: z.string().min(1, 'El nombre es requerido.'),
  lastName: z.string().min(1, 'El apellido es requerido.'),
  documentNumber: z.string().min(1, 'El número de documento es requerido.'),
  role: z.enum(employeeRoles, 'El rol es requerido.'),
  phone: z.string().optional(),
  email: z.union([z.email('Email inválido.'), z.literal('')]).optional(),
  hireDate: z.string().min(1, 'La fecha de contratación es requerida.'),
  isActive: z.boolean(),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>
