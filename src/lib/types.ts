export interface SpotInfo {
  _id: number;
  Name: string;
  Zone: string;
  Picture1: string;
  /** 已收錄照片的 id，對應 static/images/spots/ 內各尺寸與格式。 */
  PictureId?: string;
  Opentime: string;
  Add: string;
  Tel: string;
  Ticketinfo: string;
}
