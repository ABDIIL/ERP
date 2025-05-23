// webapp/controller/Master.controller.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast"
], function(Controller, Filter, FilterOperator, MessageToast) {
  "use strict";
  return Controller.extend("movementsapplication.controller.Master", {

    onInit: function() {
      this._oList = this.byId("lstMovements");
      this._oOData = this.getOwnerComponent().getModel();
      this.getOwnerComponent().getRouter()
        .getRoute("master")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function() {
      this._loadMovements(); // zonder filters
    },

    _loadMovements: function(mFilterParams) {
      var sEntity = "/MovementSet";
      var m = mFilterParams || {};
      this._oOData.read(sEntity, {
        urlParameters: m,
        success: function(oData) {
          var oJSON = new sap.ui.model.json.JSONModel(oData);
          this.getView().setModel(oJSON, "movementsJSON");
        }.bind(this),
        error: function() {
          MessageToast.show("Fout bij ophalen verplaatsingen");
        }
      });
    },

    onFilterChange: function() {
      var sType = this.byId("selFilterType").getSelectedKey();
      var oDate = this.byId("dpFilterDate").getDateValue();
      var mParams = {};

      if (sType) {
        mParams.$filter = "MovementType eq '" + sType + "'";
      }
      if (oDate) {
        var sISO = oDate.toISOString().slice(0,10);
        var f = "MovementDate eq " + sISO;
        mParams.$filter = mParams.$filter 
          ? mParams.$filter + " and " + f 
          : f;
      }

      this._loadMovements(mParams);
    },

    onSelect: function(oEvent) {
      var sContext = oEvent.getParameter("listItem")
        .getBindingContext("movementsJSON")
        .getPath()
        .replace(/^\//, "");
      this.getOwnerComponent().getRouter().navTo("detail", {
        movementContext: encodeURIComponent(sContext)
      });
    },

    onCreate: function() {
      this.getOwnerComponent().getRouter().navTo("detail", {
        movementContext: "NEW"
      });
    }

  });
});
