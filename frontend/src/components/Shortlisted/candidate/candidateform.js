import React, {  useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../utils/controls/Controls";
import { useForm, Form } from '../../utils/useForm';
import * as employeeService from "../services/employeeService";


const initialFValues = {
    id: 0,
    departmentId: '',
}

export default function CandidateForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('departmentId' in fieldValues)
            temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={12}>
                    <Controls.Select
                        name="departmentId"
                        label="Status"
                        value={values.departmentId}
                        onChange={handleInputChange}
                        options={employeeService.getDepartmentCollection()}
                        error={errors.departmentId}
                    />

                    <div>
                        <Controls.Button
                            type="submit"
                            text="Update" />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
