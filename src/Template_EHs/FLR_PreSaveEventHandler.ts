// Daniel Jones - SFTS - 2022

const preSaveText =
`
/*
 * File: SFTS_Default_Event_Handlers/FLR_PreSaveEventHandler.cs
 * Date: 01.03.2016 (last revision)
 * Description: This example demonstrates coding consistency checks and automatic population of fields which are not present on the layout.
*/

using System;
using kCura.EventHandler;

namespace SFTS_Default_Event_Handlers
{
    //Set a description for this event handler
    [kCura.EventHandler.CustomAttributes.Description("Example Pre-Save Event Handler for First Level Relevance Review which demonstrates coding consistency checks and automatic population of fields.")]
    
    public class FLR_PreSaveEventHandler_9_5_1 : PreSaveEventHandler
    {
        public override Response Execute()
        {
            Response retVal = new Response();
            retVal.Success = true;
            retVal.Message = String.Empty;

            // Check the active layout
            if (this.ActiveLayout.Name.Equals("Review - First Level Relevance"))
            {
                // Consistency error flag
                bool codingIsConsistent = true;

                // Check coding consistency
                try
                {
                    // Prepare all necessary variables for consistency checks
                    Field FlrDecision = this.ActiveArtifact.Fields["Review - FLR Decision"];
                    ChoiceFieldValue FlrDecisionChoice = (ChoiceFieldValue) FlrDecision.Value;
                    Field FlrComment = this.ActiveArtifact.Fields["Review - FLR Comment"];
                
                    // Check each rule

                    /* Use this section if a reviewer comment should be mandatory for relevant documents
                    if (FlrDecisionChoice.IsChoiceSelected("Relevant") && FlrComment.Value.IsNull)
                    {
                        codingIsConsistent = false;
                        retVal.Message = retVal.Message + "<li>A <b>comment is mandatory</b> for documents <b>marked as Relevant</b></li>";
                    }
                     */
                    
                    // Present consistency warnings to the user
                    if (codingIsConsistent == false)
                    {
                        retVal.Message = "Please revise your coding:<ul>" + retVal.Message + "</ul>";
                        retVal.Success = codingIsConsistent;
                        return retVal;
                    }
                }
                catch (System.Exception ex)
                {
                    retVal.Success = false;
                    retVal.Message = "PreSave EventHandler failure during coding consistency check: " + ex;
                    return retVal;
                }
                
                // Automatic poulation of fields
                try
                {
                    // Prepare the fields 
                    Field firstReviewDate = this.ActiveArtifact.Fields["Review - FLR Reviewed On"];
                    Field firstReviewerName = this.ActiveArtifact.Fields["Review - FLR Reviewed By"];
                    Field lastReviewerName = this.ActiveArtifact.Fields["Review - FLR Last Modified By"];
                    Field lastReviewDate = this.ActiveArtifact.Fields["Review - FLR Last Modified On"];


                    // If the 'Reviewed On' field is not set, the 'Reviewed On'/'Reviewed By' fields are populated (--> only on the first edit of the document)
                    if (firstReviewDate.Value.IsNull)
                    {
                        firstReviewDate.Value.Value = DateTime.Now;
                        firstReviewerName.Value.Value = Helper.GetAuthenticationManager().UserInfo.WorkspaceUserArtifactID;
                    }

                    // The 'Last Modified' field are always populated with the current date and current user
                    lastReviewDate.Value.Value = DateTime.Now;
                    lastReviewerName.Value.Value = Helper.GetAuthenticationManager().UserInfo.WorkspaceUserArtifactID;
                }
                catch (System.Exception ex)
                {
                    retVal.Success = false;
                    retVal.Message = "PreSave EventHandler failure during automatic population: " + ex;
                    return retVal;
                }
            }

            return retVal;
        }

        public override FieldCollection RequiredFields
        {
            get
            {
                // editable fields which are not present on the layout need to be added here
                FieldCollection addedFields = new FieldCollection();
                addedFields.Add(new kCura.EventHandler.Field("Review - FLR Reviewed On"));
                addedFields.Add(new kCura.EventHandler.Field("Review - FLR Reviewed By"));
                addedFields.Add(new kCura.EventHandler.Field("Review - FLR Last Modified By"));
                addedFields.Add(new kCura.EventHandler.Field("Review - FLR Last Modified On"));
                return addedFields;
            }
        }
    }
}
`;
export { preSaveText };
