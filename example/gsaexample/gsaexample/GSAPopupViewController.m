//
//  GSAPopupViewController.m
//  gsaexample
//
//  Created by BaoLei on 1/16/13.
//  Copyright (c) 2013 Hulu. All rights reserved. See LICENSE.txt.
//

#import "GSAPopupViewController.h"

@implementation GSAPopupViewController

- (void)loadView {
    [super loadView];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    UILabel* title = [[UILabel alloc] init];
    title.text = @"A modal view";
    
    UIButton* button = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [button setTitle:@"Close" forState:UIControlStateNormal];
    [button addTarget:self action:@selector(close:) forControlEvents:UIControlEventTouchUpInside];
    
    UITableView* table = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStyleGrouped];
    table.delegate = self;
    table.dataSource = self;
    table.backgroundView = nil;
    
    [@[title, button, table] enumerateObjectsUsingBlock:^(UIView* view, NSUInteger idx, BOOL *stop) {
        view.translatesAutoresizingMaskIntoConstraints = NO;
        [self.view addSubview:view];
    }];
    
    NSDictionary* viewDict = NSDictionaryOfVariableBindings(title, button, table);
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|-10-[title]-10-[button]-10-[table]|" options:NSLayoutFormatAlignAllCenterX metrics:nil views:viewDict]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"|[table]|" options:0 metrics:nil views:viewDict]];
    [self.view addConstraint:[NSLayoutConstraint constraintWithItem:title attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self.view attribute:NSLayoutAttributeCenterX multiplier:1 constant:0]];
    
}

- (void)setTxt:(NSString *)txt {
    words_ = [txt componentsSeparatedByString:@" "];
    NSMutableArray* array = [[NSMutableArray alloc] initWithCapacity:words_.count];
    [words_ enumerateObjectsUsingBlock:^(NSString* word, NSUInteger idx, BOOL *stop) {
        NSMutableArray* chars = [NSMutableArray array];
        for (int i=0; i<word.length; i++) {
            [chars addObject:[word substringWithRange:NSMakeRange(i, 1)]];
        }
        [array addObject:chars];
    }];
    charArrays_ = array;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return words_.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [[charArrays_ objectAtIndex:section] count];
}

- (UITableViewCell*)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSString* identifier = @"cell";
    UITableViewCell* cell = [tableView dequeueReusableCellWithIdentifier:identifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:identifier];
    }
    cell.textLabel.text = [[charArrays_ objectAtIndex:indexPath.section] objectAtIndex:indexPath.row];
    return cell;
}

- (NSString*)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return [words_ objectAtIndex:section];
}

- (void)close:(id)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
