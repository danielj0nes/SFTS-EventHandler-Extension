// Daniel Jones - SFTS - 2022

const preLoadText =
`
/*
 * File: SFTS_Default_Event_Handlers/FLR_PreLoadEventHandler.cs
 * Date: 01.03.2016 (last revision)
 * Description: This Event Handler preselects the 'Not Relevant' choice (by ArtifactID) on the field 'Review - FLR Decision'.
*/
using System;
using System.Collections;
using kCura.EventHandler;

namespace SFTS_Default_Event_Handlers
{
    //Set a description for this event handler
    [kCura.EventHandler.CustomAttributes.Description("This Event Handler preselects the 'Not Relevant' choice (by ArtifactID) on the field 'Review - FLR Decision'.")]

    public class FLR_PreLoadEventHandler_9_5_1 : PreLoadEventHandler
    {

        public override Response Execute()
        {
            Response retVal = new Response();
            retVal.Success = true;
            retVal.Message = String.Empty;

            // Check the active layout and page mode
            if (this.ActiveLayout.Name.Equals("Review - First Level Relevance") && this.PageMode == kCura.EventHandler.Helper.PageMode.Edit)
            {

                // Automatic preselection of fields
                try
                {
                    // Prepare the fields 
                    kCura.EventHandler.Field reviewField = this.ActiveArtifact.Fields["Review - FLR Decision"];
                    
                    // Check if the review field is empty
                    if (reviewField.Value.IsNull)
                    {
                        // Create ChoiceCollection containing the desired Choice 
                        const Int32 choiceArtifactID = 1042013;

                        ChoiceFieldValue myFieldValue = (ChoiceFieldValue) reviewField.Value;
                        ChoiceCollection myChoiceList = myFieldValue.Choices;
                        myChoiceList.Add(new kCura.EventHandler.Choice(choiceArtifactID, choiceArtifactID.ToString()));

                        // Assign Choice Collection to the field
                        myFieldValue.Choices = myChoiceList;
                    }
                }
                catch (System.Exception ex)
                {
                    retVal.Success = false;
                    retVal.Message = "PreLoad EventHandler failure: " + ex;
                    return retVal;
                }
            }

            return retVal;
        }

        public override FieldCollection RequiredFields
        {
            get
            {
                // no additional fields required
                FieldCollection addedFields = new FieldCollection();

                return addedFields;
            }
        }

    }
}
`;
export { preLoadText };
