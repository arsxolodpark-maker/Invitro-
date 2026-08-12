// Small flow corrections discovered during end-to-end QA.
// 1) A returned document set must be re-uploaded before resubmission.
// 2) A fully closed order marks all journey steps as completed.
// 3) A returned document branch must explicitly guide the user back to correction/upload.

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

const nextFlowInfoBeforeReturnedDocsFix = nextFlowInfo;
nextFlowInfo = function(){
  if(state.verification === 'fix' && !state.docs){
    if(state.role === 'client' && state.clientPage === 'organization'){
      return {
        text:'ДКП вернул документы на доработку. Загрузите исправленный комплект.',
        actions:flowAction('Загрузить исправленный комплект','uploadDocs()','secondary')
      };
    }
    return {
      text:'ДКП вернул документы на доработку. Следующий шаг — исправить комплект документов.',
      actions:flowAction('Исправить документы',"switchToClient('organization',null)")
    };
  }
  return nextFlowInfoBeforeReturnedDocsFix();
};
