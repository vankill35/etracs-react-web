import * as actionTypes from './actionTypes'
import Swal from 'sweetalert2';

export const setAssessmentDetail = (payload) => {
  Swal.fire('Saved!', '', 'success');
  return{
    type: actionTypes.SET_ASSESSMENT_DETAIL,
    payload: payload
  }
}
