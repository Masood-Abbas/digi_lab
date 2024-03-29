import Button from "@mui/material/Button";
import { Requestschema } from "@/schema/requestSchema";
import DialogContent from "@mui/material/DialogContent";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
} from "@/components/common/DialogTitle/DialogTitle";
import { titleSchema } from "@/schema/titleSchema";
import { useCreateDesignation, useUpdateTitle } from "@/api/titleApi";
import {
  setTitleRowSelected,
  setSubmissionData,
} from "@/store/title/titleSlice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { laboratoryTests } from "@/utils/constants";
import { checkUserAssignPermissions } from "@/utils/utils";
import axios from "axios";
import { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  createBasicDetailOfPatient,
  updateRequest,
} from "@/api/requestApi/reqest";
import { useQueryClient } from "react-query";
import { setRequests } from "@/store/request/requestSlice";

const AddRequest = ({ handleClose, open, requestById, refetch }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: null,
      lastName: null,
      CNIC: null,
      email: null,
      phoneNumber: null,
      test: null,
      gender: null,
      pdfName: null,
      age: null,
    },
    resolver: yupResolver(Requestschema),
  });

  const pdfName = watch("pdfName");
  const gender = watch("gender");
  const test = watch("test");

  useEffect(() => {
    if (requestById?.id) {
      setValue("pdfName", requestById?.pdfName);
      setValue("firstName", requestById?.firstName);
      setValue("lastName", requestById?.lastName);
      setValue("CNIC", requestById?.CNIC);
      setValue("email", requestById?.email);
      setValue("phoneNumber", requestById?.phoneNumber);
      setValue("test", requestById?.test);
      setValue("gender", requestById?.gender);
      setValue("age", requestById?.age);
    }
  }, [setValue, requestById]);

  const genderHandleOnChange = (event) => {
    clearErrors("gender");
    setValue("gender", event?.target?.value);
  };

  const testHandleOnChange = (_event, newValue) => {
    clearErrors("test");
    setValue("test", newValue);
  };

  const { isLoading: createLoading, mutate } = useMutation({
    mutationFn: (data) => createBasicDetailOfPatient(data),
    onSuccess: (res) => {
      toast.success(res.message);
      handleClose();
      refetch();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  const { isLoading: updateLoading, mutate: updateRequestData } = useMutation({
    mutationFn: (data) => updateRequest(data),
    onSuccess: (res) => {
      handleClose();
      toast.success(res.message);
      refetch();
    },
  });

  const onSubmit = (item) => {
    const data = {
      firstName: item?.firstName,
      lastName: item?.lastName,
      phoneNumber: item?.phoneNumber,
      email: item?.email,
      gender: item?.gender,
      test: item?.test,
      CNIC: item?.CNIC,
      pdfName: item?.pdfName,
      age: item?.age,
      reportStatus: "pending",
    };

    if (requestById?.id) {
      data.id = requestById?.id;
      updateRequestData(data);
    } else {
      mutate(data);
    }
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Add Patient Basic Detail
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ minWidth: 500 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                sx={{ mb: 2 }}
                label="First Name"
                fullWidth
                error={!!errors["firstName"]}
                helperText={
                  errors["firstName"] ? errors["firstName"].message : ""
                }
                {...register("firstName")}
              />
              <TextField
                sx={{ mb: 2 }}
                label="Last Name"
                fullWidth
                error={!!errors["lastName"]}
                helperText={
                  errors["lastName"] ? errors["lastName"].message : ""
                }
                {...register("lastName")}
              />

              <TextField
                sx={{ mb: 1 }}
                label="Report Id"
                fullWidth
                error={!!errors["pdfName"]}
                helperText={errors["pdfName"] ? errors["pdfName"].message : ""}
                {...register("pdfName")}
              />

              <TextField
                sx={{ mb: 1 }}
                label="Age"
                fullWidth
                error={!!errors["age"]}
                helperText={errors["age"] ? errors["age"].message : ""}
                {...register("age")}
              />

              <TextField
                sx={{ mb: 2 }}
                label="Email"
                fullWidth
                error={!!errors["email"]}
                helperText={errors["email"] ? errors["email"].message : ""}
                {...register("email")}
              />

              <TextField
                sx={{ mb: 2 }}
                label="phoneNumber"
                fullWidth
                error={!!errors["phoneNumber"]}
                helperText={
                  errors["phoneNumber"] ? errors["phoneNumber"].message : ""
                }
                {...register("phoneNumber")}
              />
              <TextField
                sx={{ mb: 2 }}
                label="CNIC"
                fullWidth
                error={!!errors["CNIC"]}
                placeholder="3520209098709"
                helperText={errors["CNIC"] ? errors["CNIC"].message : ""}
                {...register("CNIC")}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  error={!!errors["gender"]}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  defaultValue={gender}
                  label="Gender"
                  onChange={genderHandleOnChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {errors?.gender && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.gender?.message}
                </Typography>
              )}

              <Autocomplete
                sx={{ mt: 2 }}
                options={laboratoryTests}
                getOptionLabel={(option) => option}
                value={test}
                onChange={testHandleOnChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Test"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                    error={!!errors.test}
                    helperText={errors.test?.message}
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="error"
                  sx={{ py: "0.5rem", px: "1rem", mt: "1rem", mx: "0.5rem" }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  className="btn-primary"
                  sx={{
                    py: "0.55rem",
                    px: "1.5rem",
                    mt: "1rem",
                    color: "#fff",
                  }}
                  loading={updateLoading || createLoading}
                >
                  Save
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default AddRequest;
