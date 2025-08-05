import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray } from "formik";
import { toast } from "react-toastify";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    TextField,
    Zoom,
    InputAdornment
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import TitleIcon from "@material-ui/icons/Title";
import { green } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import Draggable from 'react-draggable';

// Add slide transition component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
    },
    dialog: {
        borderRadius: "8px",
        background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    },
    dialogTitle: {
        background: "#3f51b5",
        color: "white",
        padding: "16px 24px",
        borderRadius: "8px 8px 0 0",
        cursor: 'move',
    },
    dialogContent: {
        padding: "24px",
    },
    multFieldLine: {
        display: "flex",
        gap: "16px",
        marginBottom: "16px",
    },
    textField: {
        flex: 1,
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
                borderColor: "#ccc",
            },
            "&:hover fieldset": {
                borderColor: "#6a11cb",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#2575fc",
            },
        },
    },
    extraAttr: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "16px",
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
    addButton: {
        background: "linear-gradient(145deg, #6a11cb, #2575fc)",
        color: "white",
        borderRadius: "8px",
        padding: "8px 16px",
        "&:hover": {
            background: "linear-gradient(145deg, #2575fc, #6a11cb)",
        },
    },
    cancelButton: {
        background: "linear-gradient(145deg, #ff416c, #ff4b2b)",
        color: "white",
        borderRadius: "8px",
        padding: "8px 16px",
        "&:hover": {
            background: "linear-gradient(145deg, #ff4b2b, #ff416c)",
        },
    },
    saveButton: {
        background: "linear-gradient(145deg, #4caf50, #81c784)",
        color: "white",
        borderRadius: "8px",
        padding: "8px 16px",
        "&:hover": {
            background: "linear-gradient(145deg, #81c784, #4caf50)",
        },
    },
    fileInput: {
        display: "none",
    },
    fileLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
    },
}));

const FileListSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Nome muito curto")
        .required("Obrigatório"),
    message: Yup.string().required("Obrigatório"),
});

const FilesModal = ({ open, onClose, fileListId, reload }) => {
    const classes = useStyles();
    const { user } = useContext(AuthContext);

    const [files, setFiles] = useState([]);
    const [selectedFileNames, setSelectedFileNames] = useState([]);

    const initialState = {
        name: "",
        message: "",
        options: [{ name: "", path: "", mediaType: "" }],
    };

    const [fileList, setFileList] = useState(initialState);

    useEffect(() => {
        try {
            (async () => {
                if (!fileListId) return;

                const { data } = await api.get(`/files/${fileListId}`);
                setFileList(data);
            })();
        } catch (err) {
            toastError(err);
        }
    }, [fileListId, open]);

    const handleClose = () => {
        setFileList(initialState);
        setFiles([]);
        onClose();
    };

    const handleSaveFileList = async (values) => {
        const uploadFiles = async (options, filesOptions, id) => {
            const formData = new FormData();
            formData.append("fileId", id);
            formData.append("typeArch", "fileList");
            filesOptions.forEach((fileOption, index) => {
                if (fileOption.file) {
                    formData.append("files", fileOption.file);
                    formData.append("mediaType", fileOption.file.type);
                    formData.append("name", options[index].name);
                    formData.append("id", options[index].id);
                }
            });

            try {
                const { data } = await api.post(`/files/uploadList/${id}`, formData);
                setFiles([]);
                return data;
            } catch (err) {
                toastError(err);
            }
            return null;
        };

        const fileData = { ...values, userId: user.id };

        try {
            if (fileListId) {
                const { data } = await api.put(`/files/${fileListId}`, fileData);
                if (data.options.length > 0)
                    uploadFiles(data.options, values.options, fileListId);
            } else {
                const { data } = await api.post("/files", fileData);
                if (data.options.length > 0)
                    uploadFiles(data.options, values.options, data.id);
            }
            toast.success(i18n.t("fileModal.success"));
            if (typeof reload === "function") {
                reload();
            }
        } catch (err) {
            toastError(err);
        }
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            hideBackdrop={true}
            PaperProps={{
                style: {
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "1px solid #333333",
                    borderRadius: "12px",
                    boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
                }
            }}
            TransitionComponent={Transition} // Add slide transition
            classes={{ paper: classes.dialog }}
            PaperComponent={(props) => (
                <Draggable handle=".dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                    <div {...props} />
                </Draggable>
            )}
        >
            <DialogTitle 
                className={`${classes.dialogTitle} dialog-title`}
                style={{ 
                    backgroundColor: "#000000", 
                    color: "#ffffff",
                    borderBottom: "1px solid #333333"
                }}
            >
                {fileListId
                    ? `${i18n.t("fileModal.title.edit")}`
                    : `${i18n.t("fileModal.title.add")}`}
            </DialogTitle>
            <Formik
                initialValues={fileList}
                enableReinitialize={true}
                validationSchema={FileListSchema}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        handleSaveFileList(values);
                        actions.setSubmitting(false);
                    }, 400);
                }}
            >
                {({ touched, errors, isSubmitting, values }) => (
                    <Form>
                        <DialogContent 
                            className={classes.dialogContent}
                            style={{ 
                                backgroundColor: "#1a1a1a", 
                                color: "#ffffff" 
                            }}
                        >
                            <div className={classes.multFieldLine}>
                                <Field
                                    as={TextField}
                                    label={i18n.t("fileModal.form.name")}
                                    name="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    className={classes.textField}
                                    InputProps={{
                                        style: { color: "#ffffff" },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TitleIcon style={{ color: "#ffffff" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#ffffff" }
                                    }}
                                />
                            </div>
                            <div className={classes.multFieldLine}>
                                <Field
                                    as={TextField}
                                    label={i18n.t("fileModal.form.message")}
                                    type="message"
                                    multiline
                                    minRows={5}
                                    fullWidth
                                    name="message"
                                    error={touched.message && Boolean(errors.message)}
                                    helperText={touched.message && errors.message}
                                    variant="outlined"
                                    margin="dense"
                                    className={classes.textField}
                                    InputProps={{
                                        style: { color: "#ffffff" },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DescriptionIcon style={{ color: "#ffffff" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#ffffff" }
                                    }}
                                />
                            </div>

                            <Typography
                                variant="subtitle1"
                                style={{
                                    marginTop: "24px",
                                    marginBottom: "16px",
                                    fontWeight: "bold",
                                    color: "#ffffff"
                                }}
                            >
                                {i18n.t("fileModal.form.fileOptions")}
                            </Typography>

                            <FieldArray name="options">
                                {({ push, remove }) => (
                                    <>
                                        {values.options &&
                                            values.options.length > 0 &&
                                            values.options.map((info, index) => (
                                                <div
                                                    className={classes.extraAttr}
                                                    key={`${index}-info`}
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={8}>
                                                            <Field
                                                                as={TextField}
                                                                label={i18n.t("fileModal.form.extraName")}
                                                                name={`options[${index}].name`}
                                                                variant="outlined"
                                                                margin="dense"
                                                                fullWidth
                                                                className={classes.textField}
                                                                InputProps={{
                                                                    style: { color: "#ffffff" },
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <DescriptionIcon style={{ color: "#ffffff" }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                InputLabelProps={{
                                                                    style: { color: "#ffffff" }
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={4} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <input
                                type="file"
                                                                onChange={(e) => {
                                                                    const selectedFile = e.target.files[0];
                                                                    const updatedOptions = [...values.options];
                                                                    updatedOptions[index].file = selectedFile;
                                                                    setFiles("options", updatedOptions);

                                                                    const updatedFileNames = [...selectedFileNames];
                                                                    updatedFileNames[index] = selectedFile ? selectedFile.name : "";
                                                                    setSelectedFileNames(updatedFileNames);
                                                                }}
                                                                className={classes.fileInput}
                                                                name={`options[${index}].file`}
                                                                id={`file-upload-${index}`}
                                                            />
                                                            <label htmlFor={`file-upload-${index}`} className={classes.fileLabel}>
                                                                <AttachFileIcon style={{ color: "#6a11cb" }} />
                                                                <Typography variant="body2">
                                                                    {info.path ? info.path : selectedFileNames[index] || "Anexar arquivo"}
                                                                </Typography>
                                                            </label>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <DeleteOutlineIcon style={{ color: "#ff416c" }} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            ))}
                                        <Button
                                            startIcon={<AddIcon />}
                                            style={{
                                                color: "white",
                                                backgroundColor: "#4ec24e",
                                                boxShadow: "none",
                                                borderRadius: "5px",
                                            }}
                                            onClick={() => {
                                                push({ name: "", path: "" });
                                                setSelectedFileNames([...selectedFileNames, ""]);
                                            }}
                                        >
                                            {i18n.t("fileModal.buttons.fileOptions")}
                                        </Button>
                                    </>
                                )}
                            </FieldArray>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                startIcon={<CancelIcon />}
                                onClick={handleClose}
                                style={{
                                    color: "white",
                                    backgroundColor: "#db6565",
                                    boxShadow: "none",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                }}
                                disabled={isSubmitting}
                            >
                                {i18n.t("fileModal.buttons.cancel")}
                            </Button>
                            <Button
                                startIcon={<SaveIcon />}
                                type="submit"
                                style={{
                                    color: "white",
                                    backgroundColor: "#437db5",
                                    boxShadow: "none",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                }}
                                disabled={isSubmitting}
                            >
                                {fileListId
                                    ? `${i18n.t("fileModal.buttons.okEdit")}`
                                    : `${i18n.t("fileModal.buttons.okAdd")}`}
                                {isSubmitting && (
                                    <CircularProgress
                                        size={24}
                                        className={classes.buttonProgress}
                                    />
                                )}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default FilesModal;