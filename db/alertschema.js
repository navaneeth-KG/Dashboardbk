import { Schema, model } from 'mongoose';

const detailSchema = Schema({
  action: {
    type: String,
    
  },
  gid: {
    type: Number,
  
  },
  signature_id: {
    type: Number,
  
  },
  rev: {
    type: Number,
    
  },
  signature: {
    type: String,
    
  },
  category: {
    type: String,
  
  },
  severity: {
    type: Number,
    
  },
});

// Define the Alert schema
const alertSchema = Schema({
  timestamp: {
    type: Date,
   
  },
  flow_id: {
    type: Number,
    
  },
  in_iface: {
    type: String,
   
  },
  event_type: {
    type: String,
    
  },
  src_ip: {
    type: String,
    
  },
  src_port: {
    type: Number,
  
  },
  dest_ip: {
    type: String,
    
  },
  dest_port: {
    type: Number,
    
  },
  proto: {
    type: String,
    
  },
  alert: detailSchema,
});

const Alert = model('Alert', alertSchema);

export default Alert;
