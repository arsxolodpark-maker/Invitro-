// Small flow corrections discovered during end-to-end QA.
// 1) A returned document set must be re-uploaded before resubmission.
// 2) A fully closed order marks all journey steps as completed.

const verifyBeforeQaFix = verify;
verify = function(ok){
  if(!ok) state.docs = false;
  verifyBeforeQaFix(ok);
};

const flowStageBeforeQaFix = flowStage;
flowStage = function(){
  if(state.closing === 'closed') return FLOW_STEPS.length;
  return flowStageBeforeQaFix();
};
