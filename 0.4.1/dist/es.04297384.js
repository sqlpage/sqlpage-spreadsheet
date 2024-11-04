!function(){function e(e,t,n,i){Object.defineProperty(e,t,{get:n,set:i,enumerable:!0,configurable:!0})}var t=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequire26fc,n=t.register;n("kB4bq",function(n,i){e(n.exports,"SetTextSelectionsOperation",function(){return g}),e(n.exports,"DocSelectionManagerService",function(){return m}),e(n.exports,"DocSkeletonManagerService",function(){return C}),e(n.exports,"DocStateEmitService",function(){return M}),e(n.exports,"RichTextEditingMutation",function(){return T}),e(n.exports,"UniverDocsPlugin",function(){return W}),e(n.exports,"DocInterceptorService",function(){return F});var r=t("83KcA"),s=t("D79YY"),o=t("jv4BO"),c=t("2Ha4T"),a=t("cZW0b"),l=Object.defineProperty,u=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,d=(e,t)=>l(e,"name",{value:t,configurable:!0}),h=(e,t,n)=>u(e,"symbol"!=typeof t?t+"":t,n);let g={id:"doc.operation.set-selections",type:r.CommandType.OPERATION,handler:/* @__PURE__ */d(()=>!0,"handler")};var _,p=Object.defineProperty,S=Object.getOwnPropertyDescriptor,f=/* @__PURE__ */d((e,t,n,i)=>{for(var r,s=i>1?void 0:i?S(t,n):t,o=e.length-1;o>=0;o--)(r=e[o])&&(s=(i?r(t,n,s):r(s))||s);return i&&s&&p(t,n,s),s},"__decorateClass$4"),I=/* @__PURE__ */d((e,t)=>(n,i)=>t(n,i,e),"__decorateParam$4");let m=(d(_=class extends r.RxDisposable{constructor(e,t){super(),h(this,"_currentSelection",null),h(this,"_textSelectionInfo",/* @__PURE__ */new Map),h(this,"_textSelection$",new c.Subject),h(this,"textSelection$",this._textSelection$.asObservable()),h(this,"_refreshSelection$",new o.BehaviorSubject(null)),h(this,"refreshSelection$",this._refreshSelection$.asObservable()),this._commandService=e,this._univerInstanceService=t,this._listenCurrentUnit()}_listenCurrentUnit(){this._univerInstanceService.getCurrentTypeOfUnit$(r.UniverInstanceType.UNIVER_DOC).pipe((0,a.takeUntil)(this.dispose$)).subscribe(e=>{if(null==e)return;let t=e.getUnitId();this._setCurrentSelectionNotRefresh({unitId:t,subUnitId:t})})}__getCurrentSelection(){return this._currentSelection}getSelectionInfo(e=this._currentSelection){return this._getTextRanges(e)}refreshSelection(e=this._currentSelection){null!=e&&this._refresh(e)}__TEST_ONLY_setCurrentSelection(e){this._currentSelection=e,this._refresh(e)}getTextRanges(e=this._currentSelection){var t;return null==(t=this._getTextRanges(e))?void 0:t.textRanges}getRectRanges(e=this._currentSelection){var t;return null==(t=this._getTextRanges(e))?void 0:t.rectRanges}getDocRanges(e=this._currentSelection){var t,n;return[...null!=(t=this.getTextRanges(e))?t:[],...null!=(n=this.getRectRanges(e))?n:[]].filter(e=>null!=e.startOffset&&null!=e.endOffset).sort((e,t)=>e.startOffset>t.startOffset?1:e.startOffset<t.startOffset?-1:0)}getActiveTextRange(){let e=this._getTextRanges(this._currentSelection);if(null==e)return;let{textRanges:t}=e;return t.find(e=>e.isActive)}getActiveRectRange(){let e=this._getTextRanges(this._currentSelection);if(null==e)return;let{rectRanges:t}=e;return t.find(e=>e.isActive)}__TEST_ONLY_add(e,t=!0){null!=this._currentSelection&&this._addByParam({...this._currentSelection,textRanges:e,rectRanges:[],segmentId:"",segmentPage:-1,isEditing:t,style:s.NORMAL_TEXT_SELECTION_PLUGIN_STYLE})}replaceTextRanges(e,t=!0,n){return this.replaceDocRanges(e,this._currentSelection,t,n)}replaceDocRanges(e,t=this._currentSelection,n=!0,i){if(null==t)return;let{unitId:r,subUnitId:s}=t;this._refreshSelection$.next({unitId:r,subUnitId:s,docRanges:e,isEditing:n,options:i})}__replaceTextRangesWithNoRefresh(e){if(null==this._currentSelection)return;let t={...this._currentSelection,...e};this._replaceByParam(t),this._textSelection$.next(t);let{unitId:n,subUnitId:i,segmentId:r,style:s,textRanges:o,rectRanges:c,isEditing:a}=t,l=[...o,...c].filter(e=>null!=e.startOffset&&null!=e.endOffset).sort((e,t)=>e.startOffset>t.startOffset?1:e.startOffset<t.startOffset?-1:0);this._commandService.executeCommand(g.id,{unitId:n,subUnitId:i,segmentId:r,style:s,isEditing:a,ranges:l})}dispose(){this._textSelection$.complete()}_setCurrentSelectionNotRefresh(e){this._currentSelection=e}_getTextRanges(e){var t;if(null==e)return;let{unitId:n,subUnitId:i=""}=e;return null==(t=this._textSelectionInfo.get(n))?void 0:t.get(i)}_refresh(e){let t=this._getTextRanges(e);if(null==t)return;let{textRanges:n,rectRanges:i}=t,r=[...n,...i],{unitId:s,subUnitId:o}=e;this._refreshSelection$.next({unitId:s,subUnitId:o,docRanges:r,isEditing:!1})}_replaceByParam(e){let{unitId:t,subUnitId:n,...i}=e;this._textSelectionInfo.has(t)||this._textSelectionInfo.set(t,/* @__PURE__ */new Map),this._textSelectionInfo.get(t).set(n,{...i})}_addByParam(e){let{unitId:t,subUnitId:n,...i}=e;this._textSelectionInfo.has(t)||this._textSelectionInfo.set(t,/* @__PURE__ */new Map);let r=this._textSelectionInfo.get(t);r.has(n)?r.get(n).textRanges.push(...e.textRanges):r.set(n,{...i})}},"DocSelectionManagerService"),_);m=f([I(0,r.ICommandService),I(1,r.IUniverInstanceService)],m);var v,x=Object.defineProperty,R=Object.getOwnPropertyDescriptor,b=/* @__PURE__ */d((e,t,n,i)=>{for(var r,s=i>1?void 0:i?R(t,n):t,o=e.length-1;o>=0;o--)(r=e[o])&&(s=(i?r(t,n,s):r(s))||s);return i&&s&&x(t,n,s),s},"__decorateClass$3"),O=/* @__PURE__ */d((e,t)=>(n,i)=>t(n,i,e),"__decorateParam$3");let C=(d(v=class extends r.RxDisposable{constructor(e,t,n){super(),h(this,"_skeleton"),h(this,"_docViewModel"),h(this,"_currentSkeleton$",new o.BehaviorSubject(null)),h(this,"currentSkeleton$",this._currentSkeleton$.asObservable()),h(this,"_currentSkeletonBefore$",new o.BehaviorSubject(null)),h(this,"currentSkeletonBefore$",this._currentSkeletonBefore$.asObservable()),h(this,"_currentViewModel$",new o.BehaviorSubject(null)),h(this,"currentViewModel$",this._currentViewModel$.asObservable()),this._context=e,this._localeService=t,this._univerInstanceService=n,this._init(),this._univerInstanceService.getCurrentTypeOfUnit$(r.UniverInstanceType.UNIVER_DOC).pipe((0,a.takeUntil)(this.dispose$)).subscribe(e=>{e&&e.getUnitId()===this._context.unitId&&this._update(e)})}dispose(){super.dispose(),this._currentSkeletonBefore$.complete(),this._currentSkeleton$.complete()}getSkeleton(){return this._skeleton}getViewModel(){return this._docViewModel}_init(){let e=this._context.unit;this._update(e)}_update(e){let t=this._context.unitId;if(null==e.getBody())return;this._docViewModel&&(0,r.isInternalEditorID)(t)?(this._docViewModel.reset(e),this._context.unit=e):this._docViewModel||(this._docViewModel=this._buildDocViewModel(e)),this._skeleton||(this._skeleton=this._buildSkeleton(this._docViewModel));let n=this._skeleton;n.calculate(),this._currentSkeletonBefore$.next(n),this._currentSkeleton$.next(n),this._currentViewModel$.next(this._docViewModel)}_buildSkeleton(e){return(0,s.DocumentSkeleton).create(e,this._localeService)}_buildDocViewModel(e){return new s.DocumentViewModel(e)}},"DocSkeletonManagerService"),v);C=b([O(1,(0,r.Inject)(r.LocaleService)),O(2,r.IUniverInstanceService)],C);let D=class extends r.RxDisposable{constructor(){super(),h(this,"_docStateChangeParams$",new o.BehaviorSubject(null)),h(this,"docStateChangeParams$",this._docStateChangeParams$.asObservable())}emitStateChangeInfo(e){this._docStateChangeParams$.next(e)}dispose(){super.dispose(),this._docStateChangeParams$.complete()}};d(D,"DocStateEmitService");let M=D,y="doc.mutation.rich-text-editing",T={id:y,type:r.CommandType.MUTATION,handler:/* @__PURE__ */d((e,t)=>{var n,i;let{unitId:o,segmentId:c="",actions:a,textRanges:l,prevTextRanges:u,trigger:d,noHistory:h,isCompositionEnd:g,noNeedSetTextRange:_,debounce:p,isEditing:S=!0,isSync:f,syncer:I}=t,v=e.get(r.IUniverInstanceService),x=e.get(s.IRenderManagerService),R=e.get(M),b=v.getUniverDocInstance(o),O=null==(n=x.getRenderById(o))?void 0:n.with(C).getViewModel();if(null==b||null==O)throw Error(`DocumentDataModel or documentViewModel not found for unitId: ${o}`);let D=e.get(m),T=null!=(i=D.getDocRanges())?i:[],U=!!b.getSnapshot().disabled;if((0,r.JSONX).isNoop(a)||a&&0===a.length||U)return{unitId:o,actions:[],textRanges:T};let w=(0,r.JSONX).invertWithDoc(a,b.getSnapshot());return b.apply(a),O.reset(b),!_&&l&&null!=d&&queueMicrotask(()=>{D.replaceDocRanges(l,{unitId:o,subUnitId:o},S,t.options)}),R.emitStateChangeInfo({commandId:y,unitId:o,segmentId:c,trigger:d,noHistory:h,debounce:p,redoState:{actions:a,textRanges:l},undoState:{actions:w,textRanges:null!=u?u:T},isCompositionEnd:g,isSync:f,syncer:I}),{unitId:o,actions:w,textRanges:T}},"handler")},U={id:"doc.mutation.rename-doc",type:r.CommandType.MUTATION,handler:/* @__PURE__ */d((e,t)=>{let n=e.get(r.IUniverInstanceService).getUnit(t.unitId,r.UniverInstanceType.UNIVER_DOC);return!!n&&(n.setName(t.name),!0)},"handler")},w={};var $,E=Object.defineProperty,N=Object.getOwnPropertyDescriptor,P=/* @__PURE__ */d((e,t,n,i)=>{for(var r,s=i>1?void 0:i?N(t,n):t,o=e.length-1;o>=0;o--)(r=e[o])&&(s=(i?r(t,n,s):r(s))||s);return i&&s&&E(t,n,s),s},"__decorateClass$2"),j=/* @__PURE__ */d((e,t)=>(n,i)=>t(n,i,e),"__decorateParam$2");let k=(d($=class extends r.Disposable{constructor(e,t,n){super(),this._commandService=e,this._textSelectionManagerService=t,this._univerInstanceService=n,this._initSelectionChange()}_transformCustomRange(e,t){var n;let{startOffset:i,endOffset:s,collapsed:o}=t,c=null==(n=e.getCustomRanges())?void 0:n.filter(e=>!!e.wholeEntity&&(!(i<=e.startIndex)||!(s>e.endIndex))&&(o?e.startIndex<i&&e.endIndex>=s:(0,r.BuildTextUtils).range.isIntersects(i,s-1,e.startIndex,e.endIndex)));if(null!=c&&c.length){let e=i,n=s;return c.forEach(t=>{e=Math.min(t.startIndex,e),n=Math.max(t.endIndex+1,n)}),{...t,startOffset:e,endOffset:n,collapsed:e===n}}return t}_initSelectionChange(){this.disposeWithMe(this._commandService.onCommandExecuted(e=>{if(e.id===g.id){let{unitId:t,ranges:n,isEditing:i}=e.params,r=this._univerInstanceService.getUnit(t);if(!r)return;let s=n.map(e=>this._transformCustomRange(r,e));s.some((e,t)=>n[t]!==e)&&this._textSelectionManagerService.replaceTextRanges(s,i)}}))}},"DocCustomRangeController"),$);k=P([j(0,r.ICommandService),j(1,(0,r.Inject)(m)),j(2,r.IUniverInstanceService)],k);var B=Object.defineProperty,V=Object.getOwnPropertyDescriptor,A=/* @__PURE__ */d((e,t,n,i)=>{for(var r,s=i>1?void 0:i?V(t,n):t,o=e.length-1;o>=0;o--)(r=e[o])&&(s=(i?r(t,n,s):r(s))||s);return i&&s&&B(t,n,s),s},"__decorateClass$1"),L=/* @__PURE__ */d((e,t)=>(n,i)=>t(n,i,e),"__decorateParam$1");let W=(d(G=class extends r.Plugin{constructor(e=w,t,n){super(),this._config=e,this._injector=t,this._configService=n;let{...i}=this._config;this._configService.setConfig("docs.config",i)}onStarting(){this._initializeDependencies(),this._initializeCommands()}_initializeCommands(){[T,U,g].forEach(e=>{this._injector.get(r.ICommandService).registerCommand(e)})}_initializeDependencies(){[[m],[M],[k]].forEach(e=>this._injector.add(e))}onReady(){this._injector.get(k)}},"UniverDocsPlugin"),h(G,"pluginName","DOCS_PLUGIN"),G);W=A([L(1,(0,r.Inject)(r.Injector)),L(2,r.IConfigService)],W);let Y={CUSTOM_RANGE:(0,r.createInterceptorKey)("CUSTOM_RANGE"),CUSTOM_DECORATION:(0,r.createInterceptorKey)("CUSTOM_DECORATION")};var G,z,K=Object.defineProperty,q=Object.getOwnPropertyDescriptor,H=/* @__PURE__ */d((e,t,n,i)=>{for(var r,s=i>1?void 0:i?q(t,n):t,o=e.length-1;o>=0;o--)(r=e[o])&&(s=(i?r(t,n,s):r(s))||s);return i&&s&&K(t,n,s),s},"__decorateClass"),X=/* @__PURE__ */d((e,t)=>(n,i)=>t(n,i,e),"__decorateParam");let F=(z=class extends r.Disposable{constructor(e,t){super(),h(this,"_interceptorsByName",/* @__PURE__ */new Map),this._context=e,this._docSkeletonManagerService=t;let n=this._docSkeletonManagerService.getViewModel(),i=n.getDataModel().getUnitId();if(i===r.DOCS_NORMAL_EDITOR_UNIT_ID_KEY||i===r.DOCS_FORMULA_BAR_EDITOR_UNIT_ID_KEY)return;this.disposeWithMe(this.interceptDocumentViewModel(n)),this.disposeWithMe(this.intercept(Y.CUSTOM_RANGE,{priority:-1,handler:/* @__PURE__ */d((e,t,n)=>n(e),"handler")}));let s=new r.DisposableCollection;n.segmentViewModels$.subscribe(e=>{s.dispose(),s=new r.DisposableCollection,e.forEach(e=>{s.add(this.interceptDocumentViewModel(e))})}),this.disposeWithMe(s)}intercept(e,t){this._interceptorsByName.has(e)||this._interceptorsByName.set(e,[]);let n=this._interceptorsByName.get(e);return n.push(t),this._interceptorsByName.set(e,n.sort((e,t)=>{var n,i;return(null!=(n=t.priority)?n:0)-(null!=(i=e.priority)?i:0)})),this.disposeWithMe((0,r.toDisposable)(()=>(0,r.remove)(this._interceptorsByName.get(e),t)))}fetchThroughInterceptors(e){let t=this._interceptorsByName.get(e);return(0,r.composeInterceptors)(t||[])}interceptDocumentViewModel(e){let t=new r.DisposableCollection;return t.add(e.registerCustomRangeInterceptor({getCustomRange:/* @__PURE__ */d(t=>{var n;return this.fetchThroughInterceptors(Y.CUSTOM_RANGE)(e.getCustomRangeRaw(t),{index:t,unitId:e.getDataModel().getUnitId(),customRanges:null!=(n=e.getDataModel().getCustomRanges())?n:[]})},"getCustomRange"),getCustomDecoration:/* @__PURE__ */d(t=>{var n;return this.fetchThroughInterceptors(Y.CUSTOM_DECORATION)(e.getCustomDecorationRaw(t),{index:t,unitId:e.getDataModel().getUnitId(),customDecorations:null!=(n=e.getDataModel().getCustomDecorations())?n:[]})},"getCustomDecoration")})),t}},d(z,"DocInterceptorService"),z);F=H([X(1,(0,r.Inject)(C))],F)}),n("cZW0b",function(n,i){e(n.exports,"takeUntil",function(){return a});var r=t("jaOYC"),s=t("hMcgT"),o=t("jzqEI"),c=t("gyLB6");function a(e){return(0,r.operate)(function(t,n){(0,o.innerFrom)(e).subscribe((0,s.createOperatorSubscriber)(n,function(){return n.complete()},c.noop)),n.closed||t.subscribe(n)})}})}();
//# sourceMappingURL=es.04297384.js.map
