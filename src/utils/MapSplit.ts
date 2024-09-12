import L, { Control, DomUtil, DomEvent, Layer, Map, Evented } from "leaflet";
import type { LeafletEventHandlerFn, ControlPosition } from "leaflet";

// Declare variables with appropriate types
let mapWasDragEnabled = false;
let mapWasTapEnabled = false;

// Utility function to attach multiple events
function on(
  el: HTMLElement,
  types: string,
  fn: LeafletEventHandlerFn,
  context?: any
): void {
  types.split(" ").forEach((type) => DomEvent.on(el, type, fn, context));
}

// Utility function to remove multiple events
function off(
  el: HTMLElement,
  types: string,
  fn: LeafletEventHandlerFn,
  context?: any
): void {
  types.split(" ").forEach((type) => DomEvent.off(el, type, fn, context));
}

// Utility function to determine which event to use for range inputs
function getRangeEvent(rangeInput: HTMLInputElement): string {
  return "oninput" in rangeInput ? "input" : "change";
}

// Function to disable map dragging and tapping
function cancelMapDrag(this: L.Control): void {
  if (!this._map) return;
  mapWasDragEnabled = this._map.dragging.enabled();
  mapWasTapEnabled = this._map.tap?.enabled() || false;
  this._map.dragging.disable();
  this._map.tap?.disable();
}

// Function to re-enable map dragging and tapping
function uncancelMapDrag(this: L.Control, e: any): void {
  //this._refocusOnMap(e);
  if (mapWasDragEnabled) this._map?.dragging.enable();
  if (mapWasTapEnabled) this._map?.tap?.enable();
}

// Convert argument to an array
function asArray<T>(arg: T | T[] | undefined): T[] {
  return arg ? (Array.isArray(arg) ? arg : [arg]) : [];
}

// Extend Leaflet Control for SplitMap functionality
interface SplitMapOptions extends L.ControlOptions {
  thumbSize: number;
  padding: number;
}

class SplitMapControl extends (Control, Evented) {
  public options: SplitMapOptions;
  private _leftLayers: Layer[];
  private _rightLayers: Layer[];
  private _container?: HTMLElement;
  private _divider?: HTMLElement;
  private _range?: HTMLInputElement;

  constructor(
    leftLayers: Layer | Layer[],
    rightLayers: Layer | Layer[],
    options?: Partial<SplitMapOptions>
  ) {
    super(options); // Call parent constructor with options
    this._leftLayers = Array.isArray(leftLayers) ? leftLayers : [leftLayers];
    this._rightLayers = Array.isArray(rightLayers)
      ? rightLayers
      : [rightLayers];

    // Ensure options are initialized with default values
    this.options = {
      thumbSize: 41, // Default value
      padding: 0, // Default value
      ...options, // Override with provided options
    } as SplitMapOptions; // Type assertion to ensure proper type
  }

  getPosition(): number {
    if (!this._map || !this._range) return 0;
    const rangeValue = parseFloat(this._range.value);
    const offset =
      (0.5 - rangeValue) * (2 * this.options.padding + this.options.thumbSize);
    return this._map.getSize().x * rangeValue + offset;
  }

  setPosition(_position: ControlPosition): this {
    // Position setting is not relevant for this control
    return this;
  }

  addTo(map: Map): this {
    this.remove(); // Remove existing control if any
    this._map = map;
    this._container = DomUtil.create(
      "div",
      "leaflet-sbs",
      map._controlContainer
    );
    this._divider = DomUtil.create(
      "div",
      "leaflet-sbs-divider",
      this._container
    );
    this._range = DomUtil.create(
      "input",
      "leaflet-sbs-range",
      this._container
    ) as HTMLInputElement;
    this._range.type = "range";
    this._range.min = "0";
    this._range.max = "1";
    this._range.step = "any";
    this._range.value = "0.5";
    this._range.style.paddingLeft =
      this._range.style.paddingRight = `${this.options.padding}px`;

    this._addEvents();
    this._updateClip();
    return this;
  }

  remove(): this {
    if (!this._map) return this;

    this._clearClipping();
    this._removeEvents();
    if (this._container) DomUtil.remove(this._container);
    this._map = null;

    return this;
  }

  private _clearClipping(): void {
    this._leftLayers.forEach((layer) => {
      const container =
        (layer as any).getContainer?.() || (layer as any).getPane();
      if (container) container.style.clip = "";
    });
    this._rightLayers.forEach((layer) => {
      const container =
        (layer as any).getContainer?.() || (layer as any).getPane();
      if (container) container.style.clip = "";
    });
  }

  private _updateClip(): void {
    if (!this._map) return;

    const nw = this._map.containerPointToLayerPoint([0, 0]);
    const se = this._map.containerPointToLayerPoint(this._map.getSize());
    const clipX = nw.x + this.getPosition();
    const dividerX = this.getPosition();

    if (this._divider) this._divider.style.left = `${dividerX}px`;
    this.fire("dividermove", { x: dividerX });

    const clipLeft = `rect(${[nw.y, clipX, se.y, nw.x].join("px,")}px)`;
    const clipRight = `rect(${[nw.y, se.x, se.y, clipX].join("px,")}px)`;

    this._leftLayers.forEach((layer) => {
      const container =
        (layer as any).getContainer?.() || (layer as any).getPane();
      if (container) container.style.clip = clipLeft;
    });

    this._rightLayers.forEach((layer) => {
      const container =
        (layer as any).getContainer?.() || (layer as any).getPane();
      if (container) container.style.clip = clipRight;
    });
  }

  private _addEvents(): void {
    if (!this._map || !this._range) return;

    this._map.on("move", this._updateClip, this);
    this._map.on("layeradd layerremove", this._updateLayers, this);
    on(this._range, getRangeEvent(this._range), this._updateClip, this);
    on(
      this._range,
      "ontouchstart" in window ? "touchstart" : "mousedown",
      cancelMapDrag.bind(this),
      this
    );
    on(
      this._range,
      "ontouchend" in window ? "touchend" : "mouseup",
      uncancelMapDrag.bind(this),
      this
    );
  }

  private _removeEvents(): void {
    if (!this._map || !this._range) return;

    off(this._range, getRangeEvent(this._range), this._updateClip, this);
    off(
      this._range,
      "ontouchstart" in window ? "touchstart" : "mousedown",
      cancelMapDrag.bind(this),
      this
    );
    off(
      this._range,
      "ontouchend" in window ? "touchend" : "mouseup",
      uncancelMapDrag.bind(this),
      this
    );
    this._map.off("layeradd layerremove", this._updateLayers, this);
    this._map.off("move", this._updateClip, this);
  }

  private _updateLayers(): void {
    this._updateClip();
  }

  setLeftLayers(layers: Layer | Layer[]): void {
    this._leftLayers = asArray(layers);
    this._updateLayers();
  }

  setRightLayers(layers: Layer | Layer[]): void {
    this._rightLayers = asArray(layers);
    this._updateLayers();
  }
}

// Create factory function for the SplitMap control
L.Control.SplitMap = SplitMapControl as any;
export function splitMap(
  leftLayers: Layer | Layer[],
  rightLayers: Layer | Layer[],
  options?: Partial<SplitMapOptions>
) {
  return new SplitMapControl(leftLayers, rightLayers, options);
}

export default SplitMapControl;
