// webapp/controller/Detail.controller.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("movementsapplication.controller.Detail", {
    onInit: function () {
      var oViewModel = new JSONModel({
        isCreate: false
      });
      this.getView().setModel(oViewModel, "viewModel");

      this.getOwnerComponent().getRouter()
        .getRoute("detail")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      var sCtx = oEvent.getParameter("arguments").movementContext;
      var oVM = this.getView().getModel("viewModel");
      if (sCtx === "NEW") {
        oVM.setProperty("/isCreate", true);
        this._initDraft();
        this._loadSuggestions();
      } else {
        oVM.setProperty("/isCreate", false);
        this.getView().bindElement({
          path: decodeURIComponent(sCtx),
          model: "movementModel"
        });
      }
    },

    _initDraft: function () {
      var oDraft = {
        MovementID: "",
        FromLocation: "",
        ToLocation: "",
        MovementDate: new Date(),
        MovementType: "",
        Materials: []
      };
      this.getView().setModel(new JSONModel(oDraft), "movementModel");
    },

    _loadSuggestions: function () {
      this.getOwnerComponent().getModel().callFunction("/SuggestMovementDetails", {
        method: "GET",
        success: function (oData) {
          var oSugModel = new JSONModel({ suggestions: oData.results });
          this.getView().setModel(oSugModel, "sugModel");
        }.bind(this),
        error: function () {
          MessageToast.show("Geen suggesties beschikbaar");
        }
      });
    },

    onSuggestionChange: function (oEvent) {
      var oCtx = oEvent.getSource().getSelectedItem().getBindingContext("sugModel");
      var oSug = oCtx.getObject();
      this.getView().getModel("movementModel").setData(oSug, true);
    },

    onSave: function () {
      var bCreate = this.getView().getModel("viewModel").getProperty("/isCreate"),
          oModel = this.getOwnerComponent().getModel(),
          oData  = this.getView().getModel("movementModel").getData();

      if (bCreate) {
        oModel.create("/MovementSet", oData, {
          success: function () {
            MessageToast.show("Verplaatsing aangemaakt");
            this.getOwnerComponent().getRouter().navTo("master");
          }.bind(this),
          error: function () {
            MessageToast.show("Fout bij aanmaken");
          }
        });
      } else {
        var sPath = this.getView().getBindingContext("movementModel").getPath();
        oModel.update(sPath, oData, {
          success: function () {
            MessageToast.show("Verplaatsing bijgewerkt");
            this.getOwnerComponent().getRouter().navTo("master");
          }.bind(this),
          error: function () {
            MessageToast.show("Fout bij bijwerken");
          }
        });
      }
    },

    onMarkDone: function () {
      var sPath = this.getView().getBindingContext("movementModel").getPath(),
          sId   = sPath.split("'")[1];
      this.getOwnerComponent().getModel().callFunction("/MarkMovementAsDone", {
        method: "POST",
        urlParameters: { id: sId },
        success: function () {
          MessageToast.show("Gemarkeerd als uitgevoerd");
          this.getOwnerComponent().getRouter().navTo("master");
        }.bind(this),
        error: function () {
          MessageToast.show("Fout bij markeren");
        }
      });
    },

    onMarkUndone: function () {
      var sPath = this.getView().getBindingContext("movementModel").getPath(),
          sId   = sPath.split("'")[1];
      this.getOwnerComponent().getModel().callFunction("/MarkMovementAsUndone", {
        method: "POST",
        urlParameters: { id: sId },
        success: function () {
          MessageToast.show("Gemarkeerd als onuitgevoerd");
          this.getOwnerComponent().getRouter().navTo("master");
        }.bind(this),
        error: function () {
          MessageToast.show("Fout bij markeren");
        }
      });
    },

    onAddMaterial: function () {
      var oView       = this.getView(),
          aMaterials  = oView.getModel("movementModel").getProperty("/Materials"),
          oNew        = {
            MaterialNumber: "",
            Description: "",
            Quantity: 1,
            UnitWeight: 0.0
          };
      aMaterials.push(oNew);
      oView.getModel("movementModel").setProperty("/Materials", aMaterials);
    },

    onRemoveMaterial: function (oEvent) {
      var iIndex = oEvent.getParameter("listItem")
            .getBindingContext("movementModel")
            .getPath()
            .split("/").pop(),
          aMaterials = this.getView().getModel("movementModel").getProperty("/Materials");
      aMaterials.splice(iIndex, 1);
      this.getView().getModel("movementModel").setProperty("/Materials", aMaterials);
    }

  });
});
