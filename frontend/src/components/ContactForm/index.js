import React, { useState, useEffect } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginBottom: theme.spacing(3),
		"& .MuiOutlinedInput-root": {
			borderRadius: "10px",
			background: '#2a2a2a',
			color: '#ffffff',
			"&.Mui-focused fieldset": {
				borderColor: '#437db5',
			},
		},
		"& .MuiInputLabel-outlined": {
			color: '#cccccc',
		},
		"& .MuiInputLabel-outlined.Mui-focused": {
			color: '#437db5',
		},
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: '#555555',
		},
	},

	extraAttr: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},

	btnWrapper: {
		position: "relative",
	},

	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},

	buttonCancel: {
		background: '#db6565',
		color: "white",
		borderRadius: "8px",
		padding: '10px 20px',
		fontWeight: 600,
		textTransform: 'none',
		"&:hover": {
			background: '#c55555',
		},
	},

	buttonSave: {
		background: '#437db5',
		color: "white",
		borderRadius: "8px",
		padding: '10px 20px',
		fontWeight: 600,
		textTransform: 'none',
		"&:hover": {
			background: '#3a6ba5',
		},
	},

	formContainer: {
		background: '#1a1a1a',
		padding: theme.spacing(3),
		borderRadius: '12px',
	},
}));

const ContactSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email"),
});

export function ContactForm ({ initialContact, onSave, onCancel }) {
	const classes = useStyles();

	const [contact, setContact] = useState(initialContact);

    useEffect(() => {
        setContact(initialContact);
    }, [initialContact]);

	const handleSaveContact = async values => {
		try {
			if (contact.id) {
				await api.put(`/contacts/${contact.id}`, values);
			} else {
				const { data } = await api.post("/contacts", values);
				if (onSave) {
					onSave(data);
				}
			}
			toast.success(i18n.t("contactModal.success"));
		} catch (err) {
			toastError(err);
		}
	};

    return (
        <div className={classes.formContainer}>
            <Formik
                initialValues={contact}
                enableReinitialize={true}
                validationSchema={ContactSchema}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        handleSaveContact(values);
                        actions.setSubmitting(false);
                    }, 400);
                }}
            >
                {({ values, errors, touched, isSubmitting }) => (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label={i18n.t("contactModal.form.name")}
                                    name="name"
                                    autoFocus
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    variant="outlined"
                                    margin="dense"
                                    className={classes.textField}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label={i18n.t("contactModal.form.number")}
                                    name="number"
                                    error={touched.number && Boolean(errors.number)}
                                    helperText={touched.number && errors.number}
                                    placeholder="5513912344321"
                                    variant="outlined"
                                    margin="dense"
                                    className={classes.textField}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label={i18n.t("contactModal.form.email")}
                                    name="email"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    placeholder="Email address"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button
                                            startIcon={<CancelIcon />}
                                            onClick={onCancel}
                                            disabled={isSubmitting}
                                            variant="contained"
                                            fullWidth
                                            className={classes.buttonCancel}
                                        >
                                            {i18n.t("contactModal.buttons.cancel")}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            startIcon={<SaveIcon />}
                                            type="submit"
                                            disabled={isSubmitting}
                                            variant="contained"
                                            className={`${classes.btnWrapper} ${classes.buttonSave}`}
                                            fullWidth
                                        >
                                            {contact.id
                                                ? `${i18n.t("contactModal.buttons.okEdit")}`
                                                : `${i18n.t("contactModal.buttons.okAdd")}`}
                                            {isSubmitting && (
                                                <CircularProgress
                                                    size={24}
                                                    className={classes.buttonProgress}
                                                />
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
