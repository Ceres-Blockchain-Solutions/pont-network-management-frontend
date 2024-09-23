import { Schema, model, Document } from 'mongoose';

interface IMasterKey extends Document {
  shipAddr: string;
  masterKey: Buffer;
}

const MasterKeySchema = new Schema<IMasterKey>({
  shipAddr: {
    type: String,
    required: true,
    unique: true
  },
  masterKey: {
    type: Buffer,
    required: true
  }
});

export const MasterKey = model<IMasterKey>('MasterKey', MasterKeySchema);