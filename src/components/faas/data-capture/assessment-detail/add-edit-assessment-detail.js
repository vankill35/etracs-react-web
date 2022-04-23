/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { TextField, Button, Box, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FaasTextInputController from '../../../input/faas-input';
import { useForm, Controller } from "react-hook-form";

// components
import TextInputController from '../../../input/text-input'

// redux
import { fetchSpecificClass, setSpecificClass } from '../../../../redux/specific-class/action';
import { fetchSubClass, setSubClass } from '../../../../redux/sub-class/action';
import { fetchClassificationRedux } from '../../../../redux/classification/actions';
import { removeSelectedAdjustment } from '../../../../redux/land-adjustments/actions';

const AddEditAssessmentDetail = (props) => {
    const { data, control, errors, setValue, handleSubmit, saveAssessmentDetail, assessmentDetail, setClassificationName,
        rate, setRate,
        areaType, setAreaType,
        landArea, setLandArea,
        unitValue, setUnitValue,
        marketValue, setMarketValue,
        totalLandAreaSqm, setTotalLandAreaSqm,
        totalLandAreaHa, setTotalLandAreaHa,
        landBaseMarketValue, setLandBaseMarketValue,
        landMarketValue, setLandMarketValue,
        landAssessedValue, setLandAssessedValue,
        revisionYear, setShowAdjustmentsModal, showAdjustmentsModal,
        setClassification_id, classification_id } = props;
    const dispatch = useDispatch();
    //const { control, handleSubmit, formState: { errors }, setValue } = useForm();

    // global variables
    const classificationList = useSelector((state) => state.classificationData.classification);
    const specificClassList = useSelector((state) => state.specificClassData.specificClass);
    const subClassList = useSelector((state) => state.subClassData.subClass);
    const selectedAdjustment = useSelector((state) => state.landAdjustmentData.selectedAdjustment);
    const transaction = useSelector(state => state.transactionData.transaction);

    //local state
    const [filteredClassificationList, setFilteredClassificationList] = useState();
    const [adjustmentPercent, setAdjustmentPercent] = useState("");
       // console.log(assessmentDetail)
    // filtering classification based on revision year selected
    useEffect(() => {
        const filtered = classificationList?.filter((classification) => {
            return classification.year_tag === revisionYear
        })
        setFilteredClassificationList(filtered)
    }, [classificationList, revisionYear, selectedAdjustment?.expression])

    const setData = useCallback(() => {
        dispatch(setSpecificClass());
        dispatch(setSubClass());
        if (assessmentDetail?.classification) {
            dispatch(fetchSpecificClass(assessmentDetail?.classification));
            dispatch(fetchSubClass(assessmentDetail?.classification));
        }
        setClassification_id(assessmentDetail?.classification);
        setClassificationName(assessmentDetail?.classification_name)
        setRate(assessmentDetail?.rate)
        setAreaType(assessmentDetail?.area_type)
        setLandArea(assessmentDetail?.land_area)
        setUnitValue(assessmentDetail?.unit_value)
        setMarketValue(assessmentDetail?.market_value)
        setTotalLandAreaSqm(assessmentDetail?.total_land_area_sqm)
        setTotalLandAreaHa(assessmentDetail?.total_land_area_ha)
        setLandBaseMarketValue(assessmentDetail?.land_base_market_value)
        setLandMarketValue(assessmentDetail?.land_market_value)
        setLandAssessedValue(assessmentDetail?.land_assessed_value)
    }, [assessmentDetail?.area_type, assessmentDetail?.classification, assessmentDetail?.classification_name, assessmentDetail?.land_area, assessmentDetail?.land_assessed_value, assessmentDetail?.land_base_market_value, assessmentDetail?.land_market_value, assessmentDetail?.market_value, assessmentDetail?.rate, assessmentDetail?.total_land_area_ha, assessmentDetail?.total_land_area_sqm, assessmentDetail?.unit_value, dispatch, setAreaType, setClassificationName, setClassification_id, setLandArea, setLandAssessedValue, setLandBaseMarketValue, setLandMarketValue, setMarketValue, setRate, setTotalLandAreaHa, setTotalLandAreaSqm, setUnitValue]);

    useEffect(() => {
        if (assessmentDetail?.classification) setData()
    }, [assessmentDetail, setData])

    const onClassificationChange = async (id) => {
        setClassification_id(id);
        await dispatch(fetchSpecificClass(id));
        await dispatch(fetchSubClass(id));
        await dispatch(removeSelectedAdjustment());
        // getting data of the selected id
        const filteredClassification = classificationList?.filter((classification) => {
            return classification.id == id
        })
        setRate(filteredClassification[0]?.rate !== undefined ? filteredClassification[0]?.rate + "%" : "0%")
        // setLandAssessedValue(marketValue * filteredClassification[0]?.rate)
        setLandAssessedValue(filteredClassification[0]?.rate ? Number(marketValue * (parseInt(filteredClassification[0]?.rate) / 100)).toFixed(2) : 0)
        setAreaType("")
        setUnitValue("")
       // setLandArea(0);
       // setTotalLandAreaHa(0);
       // setTotalLandAreaSqm(0);
       // setMarketValue(0);
       // setLandBaseMarketValue(0);
       // setLandMarketValue(0);
       // setLandAssessedValue(0)
        setClassificationName(filteredClassification[0]?.classification)
    }

    const onSpecificClassChange = async (id) => {
        // getting data of the selected id
        const filteredSpecicClass = specificClassList?.filter((specific) => {
            return specific.id == id
        })
        setAreaType(filteredSpecicClass[0]?.area_type)
        //setLandArea(0);
        //setTotalLandAreaHa(0);
        //setTotalLandAreaSqm(0);
        if (filteredSpecicClass[0]?.area_type === "SQM") {
            let sqmValue = landArea * 1;
            let haValue = landArea / 10000;
            setTotalLandAreaSqm(Number(sqmValue).toFixed(6))
            setTotalLandAreaHa(Number(haValue).toFixed(6))
        } else {
            let sqmValue = landArea * 10000;
            let haValue = landArea * 1;
            setTotalLandAreaSqm(Number(sqmValue).toFixed(6))
            setTotalLandAreaHa(Number(haValue).toFixed(6))
        }
    }

    const onSubClassChange = async (id) => {
        // getting data of the selected id
        const filteredSubClass = subClassList.filter((subclass) => {
            return subclass.id == id
        })
        setUnitValue(filteredSubClass[0]?.unit_value !== undefined ? filteredSubClass[0]?.unit_value + ".00" : ".00")
    }

    const onLandAreaChange = (value) => {
        setLandArea(value)
        if (areaType === "SQM") {
            let sqmValue = value * 1;
            let haValue = value / 10000;
            setTotalLandAreaSqm(Number(sqmValue).toFixed(6))
            setTotalLandAreaHa(Number(haValue).toFixed(6))
        } else {
            let sqmValue = value * 10000;
            let haValue = value * 1;
            setTotalLandAreaSqm(Number(sqmValue).toFixed(6))
            setTotalLandAreaHa(Number(haValue).toFixed(6))
        }
    }

    const onLandAreaBlur = (value) => {
        setLandArea(Number(value).toFixed(6))
    }

    const onMarketValueChange = async (value) => {
        setMarketValue(value)
        setLandBaseMarketValue(Number(value).toFixed(2))
        setLandMarketValue(Number(value).toFixed(2))
        
        if(selectedAdjustment?.expression) {
            setLandAssessedValue(Number(value * (parseInt(adjustmentPercent) / 100)).toFixed(2))
        } else {
            setLandAssessedValue(Number(value * (parseInt(rate) / 100)).toFixed(2))
        }

    }

    const onMarketValueBlur = async (value) => {
        setMarketValue(Number(value).toFixed(2))
    }

        
    const calculateAdjustment = useCallback(() => {
        if(selectedAdjustment?.expression){
            const expressionValue = selectedAdjustment?.expression?.slice(selectedAdjustment?.expression?.lastIndexOf('*') + 1) // getting the number in expression
            setAdjustmentPercent(expressionValue * 100)
            setLandAssessedValue(Number(marketValue * (parseInt(expressionValue * 100) / 100)).toFixed(2))
        }
    }, [marketValue, selectedAdjustment?.expression, setLandAssessedValue])
    
    useEffect(() => {
        calculateAdjustment()
    }, [calculateAdjustment])

    return (
        <>
            <Grid container spacing={4} style={{ marginTop: -50 }}>
                <Grid item md={12} xs={12}>
                    <Divider textAlign="left">
                        <p style={{ fontSize: 20 }}>
                            Land Assessment
                        </p>
                    </Divider>
                </Grid>
                <Grid item md={12} xs={12} style={{ marginTop: -30 }}>
                    <Grid container spacing={4}>
                        <Grid item md={4} xs={12}>
                            <Grid item md={12} xs={12}>
                                <Controller
                                    defaultValue={assessmentDetail ? assessmentDetail?.classification : ""}
                                    name={'classification'}
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Appraised date is required',
                                        },
                                        pattern: {
                                            value: /^[^-]+(?!.*--)/, // regex for not allowing (-)
                                            message: 'Civil status is required',
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextField
                                            fullWidth
                                            label="Classification*"
                                            name="classification"
                                            select
                                            SelectProps={{ native: true }}
                                            variant="outlined"
                                            onBlur={onBlur}
                                            disabled={transaction === "Change Taxability" ? true : false}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                                onClassificationChange(e.target.value)
                                                setValue("specificClass", "-Select-")
                                                setValue("subClass", "-Select-")
                                            }}
                                            size='small'
                                            error={errors.classification ? true : false}
                                            value={value}
                                        >
                                            <option key={'-Select-'} value={'-Select-'}>
                                                -Select-
                                            </option>
                                            {filteredClassificationList?.map((option) => (
                                                <option key={option.code} value={option.id}>
                                                    {option.code}
                                                </option>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item md={12} xs={12} style={{ marginTop: 10 }}>
                                <Controller
                                    defaultValue={assessmentDetail ? assessmentDetail?.specific_class : ""}
                                    name="specificClass"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Appraised date is required',
                                        },
                                        pattern: {
                                            value: /^[^-]+(?!.*--)/, // regex for not allowing (-)
                                            message: 'Civil status is required',
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextField
                                            fullWidth
                                            label="Specific Class"
                                            name="specificClass"
                                            select
                                            SelectProps={{ native: true }}
                                            variant="outlined"
                                            onBlur={onBlur}
                                            disabled={transaction === "Change Taxability" ? true : false}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                                onSpecificClassChange(e.target.value)
                                            }}
                                            size='small'
                                            error={errors.specificClass ? true : false}
                                            value={value}
                                        >
                                            <option key={'-Select-'} value={'-Select-'}>
                                                -Select-
                                            </option>
                                            {specificClassList?.map((option) => (
                                                <option key={option.code} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item md={12} xs={12} style={{ marginTop: 10 }}>
                                <Controller
                                    defaultValue={assessmentDetail ? assessmentDetail?.sub_class : ""}
                                    name="subClass"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Appraised date is required',
                                        },
                                        pattern: {
                                            value: /^[^-]+(?!.*--)/, // regex for not allowing (-)
                                            message: 'Civil status is required',
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextField
                                            fullWidth
                                            label="Sub Class*"
                                            name="subClass"
                                            select
                                            SelectProps={{ native: true }}
                                            variant="outlined"
                                            onBlur={onBlur}
                                            disabled={transaction === "Change Taxability" ? true : false}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                                onSubClassChange(e.target.value)
                                            }}
                                            size='small'
                                            error={errors.subClass ? true : false}
                                            value={value}
                                        >
                                            <option key={'-Select-'} value={'-Select-'}>
                                                -Select-
                                            </option>
                                            {subClassList?.map((option) => (
                                                <option key={option.code} value={option.id}>
                                                    {option.code}
                                                </option>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid item md={4} xs={12} >
                            <Grid item md={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Rate"
                                    name="rate"
                                    size='small'
                                    value={rate}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Area Type"
                                    name="areaType"
                                    size='small'
                                    value={areaType}
                                    style={{ marginTop: 10 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Unit Value"
                                    name="unitValue"
                                    size='small'
                                    value={unitValue}
                                    style={{ marginTop: 10 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid item md={4} xs={12}></Grid>
                        <Grid item md={4} xs={12}>
                            <Grid item md={12} xs={12}>
                                <Controller
                                    defaultValue={assessmentDetail?.land_area ? assessmentDetail?.land_area : ""}
                                    name="landArea"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Land area is required',
                                        },
                                        // validate: (landArea) => landArea > 0,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextField
                                            fullWidth
                                            label={"Land area " + (areaType === "SQM" ? "(SQM)*" : "(HA)*")}
                                            name="landArea"
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ style: { textAlign: "right" } }}
                                            disabled={transaction === "Change Taxability" ? true : false}
                                            onBlur={e => {
                                                onLandAreaBlur(e.target.value)
                                            }}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                                onLandAreaChange(e.target.value)
                                            }}
                                            size='small'
                                            error={errors.landArea ? true : false}
                                            value={landArea}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={12} xs={12} style={{ marginTop: 10 }}>
                                <Controller
                                    defaultValue={assessmentDetail?.market_value ? assessmentDetail?.market_value : ""}
                                    name="marketValue"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Market value is required',
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextField
                                            fullWidth
                                            label="Market value*"
                                            name="marketValue"
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ style: { textAlign: "right" } }}
                                            disabled={transaction === "Change Taxability" ? true : false}
                                            onBlur={e => {
                                                onMarketValueBlur(e.target.value)
                                            }}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                                onMarketValueChange(e.target.value)
                                            }}
                                            size='small'
                                            error={errors.marketValue ? true : false}
                                            value={marketValue}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid item md={4} xs={12}></Grid>
                        <Grid item md={4} xs={12}></Grid>
                        <Grid item md={4} xs={12}>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Total Land Area (SQM)"
                                    name="totalLandAreaSQM"
                                    size='small'
                                    value={totalLandAreaSqm}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Total Land Area (HA)"
                                    name="totalLandAreaHA"
                                    size='small'
                                    value={totalLandAreaHa}
                                    style={{ marginTop: 10 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Land Base Market Value"
                                    name="landBaseMarketValue"
                                    size='small'
                                    value={landBaseMarketValue}
                                    style={{ marginTop: 10 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid item md={4} xs={12}></Grid>
                        <Grid item md={4} xs={12}>
                            <Grid item md={12} xs={12}>
                                <Button
                                    style={{ marginTop: -100 }}
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    disabled={transaction === "Change Taxability" ? true : false}
                                    onClick={() => {
                                        if (classification_id == "-Select-" || classification_id == "") {
                                            Swal.fire('Please select a classification first')
                                            return;
                                        }
                                        setShowAdjustmentsModal(true);
                                    }}
                                >
                                    Actual use adjustments
                                </Button>
                                <TextField
                                    fullWidth
                                    label="Actual Adjustment"
                                    name="actualAdjustment"
                                    size='small'
                                    value={selectedAdjustment?.expression ? adjustmentPercent?.toString()+"%" : 0}
                                    style={{ marginTop: -24 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Land Market Value"
                                    name="landMarketValue"
                                    size='small'
                                    value={landMarketValue}
                                    style={{ marginTop: 2 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="'Land Assessed Value"
                                    name="landAssessedValue"
                                    size='small'
                                    value={landAssessedValue}
                                    style={{ marginTop: 10 }}
                                    inputProps={{ style: { textAlign: "right" } }}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 0,
                    marginTop: 5,
                }}
            >
                <Button
                    color="primary"
                    variant="contained"
                    // fullWidth
                    onClick={handleSubmit(saveAssessmentDetail)}
                    style={{ width: 150 }}
                >
                    save
                </Button>
            </Box>
        </>
    )
}

export default AddEditAssessmentDetail;