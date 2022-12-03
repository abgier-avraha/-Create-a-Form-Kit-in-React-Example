import { IFormKit } from '../../form-kit/FormKit';
import { DateAdapter } from './input-adapters/DateAdapter';
import { IntegerAdapter } from './input-adapters/IntegerAdapter';
import { SubmitButtonAdapter } from './input-adapters/SubmitButtonAdapter';
import { TextAdapter } from './input-adapters/TextAdapter';

export const MaterialFormKit: IFormKit = {
  Text: TextAdapter,
  Integer: IntegerAdapter,
  Date: DateAdapter,
  SubmitButton: SubmitButtonAdapter,
};
