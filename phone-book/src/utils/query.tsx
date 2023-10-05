import update from "immutability-helper";
import _ from "lodash";

export const updatePaginatedData = (
  connectionPath: any,
  previousData: any,
  newData: any
) =>
  update(
    previousData,
    _.set({}, connectionPath, {
      $set: _.get(newData, connectionPath),
    })
  );
