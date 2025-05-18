sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("movementsapplication.controller.Detail", {
      onInit: function () {
        this._oModel = this.getView().getModel();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);
      },
  
      _onRouteMatched: function (oEvent) {
        var sID = oEvent.getParameter("arguments").MovementID;
        if (sID) {
          // Bestaande movement: bind element
          this.getView().bindElement({ path: "/MovementSet('" + sID + "')" });
        } else {
          // Create-modus: leeg model voor nieuwe values
          var oNew = {
            MovementID: "",
            FromLocation: "",
            ToLocation: "",
            MovementDate: null,
            MovementType: ""
          };
          // tijdelijke JSONModel om binding te laten werken
          var oTemp = new sap.ui.model.json.JSONModel(oNew);
          this.getView().setModel(oTemp, "temp");
          this.getView().bindElement({ path: "temp>/" });
        }
      },
  
      onCreateMovement: function () {
        var oData = this.getView().getModel("temp").getData();
        // callFunction naar create_movement GW-function import
        this._oModel.callFunction("/create_movement", {
          method: "POST",
          urlParameters: {
            iv_id:             oData.MovementID,
            iv_from_location:  oData.FromLocation,
            iv_to_location:    oData.ToLocation,
            iv_movement_date:  oData.MovementDate,
            iv_movement_type:  oData.MovementType
          },
          success: function (oResult) {
            // navigeer naar nieuw aangemaakte movement
            this.getOwnerComponent().getRouter().navTo("Detail", {
              MovementID: oResult.MovementID
            });
            sap.m.MessageToast.show("Movement aangemaakt: " + oResult.MovementID);
          }.bind(this)
        });
      },
  
      onSave: function () {
        this._oModel.submitChanges({
          success: function () {
            sap.m.MessageToast.show("Wijzigingen opgeslagen");
          }
        });
      },
  
      onMarkDone: function () {
        var sID = this.getView().getBindingContext().getProperty("MovementID");
        this._oModel.callFunction("/mark_movement_as_done", {
          method: "POST",
          urlParameters: { iv_id: sID },
          success: function () {
            sap.m.MessageToast.show("Gemarkeerd als uitgevoerd");
          }
        });
      },
  
      onGetWeight: function () {
        var sID = this.getView().getBindingContext().getProperty("MovementID");
        this._oModel.callFunction("/get_total_weight", {
          method: "GET",
          urlParameters: { iv_id: sID },
          success: function (oData) {
            sap.m.MessageToast.show("Totaal gewicht: " + oData);
          }
        });
      },
  
      onAddMaterial: function () {
        // implementatie blijft gelijk
      },
  
      onRemoveMaterial: function () {
        // implementatie blijft gelijk
      },
  
      onSign: function () {
        // implementatie blijft gelijk
      }
    });
  });
  