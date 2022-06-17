export type InstanceType =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string';

export interface ICTypeSchema {
  $id: string;
  $schema: string;
  title: string;
  properties: {
    [key: string]: {
      $ref?: string;
      type?: InstanceType;
      format?: string;
    };
  };
  type: 'object';
}

export interface ICTypeMetadata {
  owner: string;
  ctypeHash: string;
  schema: ICTypeSchema;
}
