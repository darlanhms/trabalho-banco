import React from 'react'
import { Form } from 'react-bootstrap'

interface selectOption {
    label: string;
    value: any;
}

interface input {
    type?: string;
    onChange: ((event: React.ChangeEvent<any>) => void);
    options?: selectOption[];
    placeholder?: string;
    label: string;
    controlId: string;
    value: any;
}

interface props {
    inputs: input[];
}

const FormPattern:React.FC<props> = ({ inputs }) => {
  return (
    <Form>
      {inputs.map((input, index) => (
        input.type === 'select'
          ? <Form.Group key={index} controlId={input.controlId}>
            <Form.Label>{input.label}</Form.Label>
            <Form.Control value={(input.value || '')} onChange={input.onChange} as="select">
              {
                input.options ? input.options.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                )) : ''
              }
            </Form.Control>
          </Form.Group>
          : <Form.Group key={index} controlId={input.controlId}>
            <Form.Label>{input.label}</Form.Label>
            <Form.Control value={(input.value || '')} placeholder={input.placeholder || ''} onChange={input.onChange} type={ input.type || 'string' }/>
          </Form.Group>
      ))}
    </Form>
  )
}

export default FormPattern
