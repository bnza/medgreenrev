// OpenAPI 3.0 specification types
export interface OpenApiSpec {
  openapi: string
  info: {
    title: string
    description?: string
    version: string
    [key: string]: any
  }
  servers?: {
    url: string
    description?: string
    [key: string]: any
  }[]
  paths: {
    [path: string]: {
      [method: string]: {
        operationId?: string
        summary?: string
        description?: string
        parameters?: any[]
        requestBody?: any
        responses: {
          [statusCode: string]: any
        }
        [key: string]: any
      }
    }
  }
  components?: {
    schemas?: {
      [schemaName: string]: any
    }
    responses?: {
      [responseName: string]: any
    }
    parameters?: {
      [parameterName: string]: any
    }
    requestBodies?: {
      [requestBodyName: string]: any
    }
    [key: string]: any
  }

  [key: string]: any
}

export interface PathItem {
  [method: string]: Operation
}

export interface Operation {
  operationId?: string
  summary?: string
  description?: string
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses: {
    [statusCode: string]: Response
  }

  [key: string]: any
}

export interface Parameter {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  required?: boolean
  schema?: any

  [key: string]: any
}

export interface RequestBody {
  content: {
    [mediaType: string]: {
      schema?: any
      [key: string]: any
    }
  }
  required?: boolean

  [key: string]: any
}

export interface Response {
  description: string
  content?: {
    [mediaType: string]: {
      schema?: any
      [key: string]: any
    }
  }

  [key: string]: any
}
