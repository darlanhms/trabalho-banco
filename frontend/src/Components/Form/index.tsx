import React from 'react';
import { Form } from 'react-bootstrap'

interface input {
    type?: string;
    onChange: ((event: React.ChangeEvent<any>) => void);
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
                <Form.Group key={index} controlId={input.controlId}>
                    <Form.Label>{input.label}</Form.Label>
                    <Form.Control value={(input.value || "")} onChange={input.onChange} type={ input.type || "string" }/>
                </Form.Group>
            ))}
        </Form>
    )
}

export default FormPattern;
