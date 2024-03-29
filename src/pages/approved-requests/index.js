import { getBasicDetailOfPatient } from "@/api/requestApi/reqest";
import ApprovedRequestTable from "@/components/approvedRequests";
import { setRequests } from "@/store/request/requestSlice";
import React from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Loader from "@/components/common/Loader/Loader";

const ApprovedRequest = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.request);

  const { isLoading } = useQuery({
    queryKey: ["getBasicDetailOfPatients"],
    queryFn: getBasicDetailOfPatient,
    onSuccess: (res) => {
      let filteredData = res?.filter(
        (request) => request?.reportStatus === "Done"
      );
      dispatch(setRequests(filteredData));
    },
  });

  return (
    <Box component="main" className="main-content">
      {isLoading && <Loader />}
      <h1 style={{ marginBottom: "30px" }}>Approved Reports</h1>
      <ApprovedRequestTable row={requests} />
    </Box>
  );
};

export default ApprovedRequest;
