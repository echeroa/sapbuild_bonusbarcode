using { sapbuild_bonusbarcode as my } from '../db/schema.cds';

@path: '/service/sapbuild_bonusbarcode'
@requires: 'authenticated-user'
service sapbuild_bonusbarcodeSrv {
  @odata.draft.enabled
  entity Customers as projection on my.Customers;
  @odata.draft.enabled
  entity Purchases as projection on my.Purchases;
  @odata.draft.enabled
  entity Redemptions as projection on my.Redemptions;
}