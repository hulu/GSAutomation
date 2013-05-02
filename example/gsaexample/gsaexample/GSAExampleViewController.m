//
//  GSAExampleViewController.m
//  gsaexample
//
//  Created by BaoLei on 1/16/13.
//  Copyright (c) 2013 Hulu. All rights reserved. See LICENSE.txt.
//

#import "GSAExampleViewController.h"
#import "GSAPopupViewController.h"

@implementation GSAExampleViewController


- (void)loadView
{
    [super loadView];
    
    self.view.backgroundColor = [UIColor blackColor];
    
    UILabel* title = [[UILabel alloc] init];
    title.text = @"An example of GSAutomation";
    title.textColor = [UIColor yellowColor];
    title.backgroundColor = self.view.backgroundColor;
    
    UIButton* button = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [button setTitle:@"Open New Window" forState:UIControlStateNormal];
    [button addTarget:self action:@selector(openModal:) forControlEvents:UIControlEventTouchUpInside];

    input = [[UITextField alloc] init];
    input.borderStyle = UITextBorderStyleRoundedRect;
    input.delegate = self;
    
    [@[title, button, input] enumerateObjectsUsingBlock:^(UIView* view, NSUInteger idx, BOOL *stop) {
        view.translatesAutoresizingMaskIntoConstraints = NO;
        [self.view addSubview:view];
    }];
        
    NSDictionary* viewDict = NSDictionaryOfVariableBindings(title, button, input);
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|-100-[title]-50-[input]-50-[button]" options:NSLayoutFormatAlignAllCenterX metrics:nil views:viewDict]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"[input(280)]" options:0 metrics:nil views:viewDict]];
    [self.view addConstraint:[NSLayoutConstraint constraintWithItem:title attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self.view attribute:NSLayoutAttributeCenterX multiplier:1 constant:0]];
    
}


- (void)openModal:(id)sender {
    GSAPopupViewController* popUp = [[GSAPopupViewController alloc] init];
    popUp.txt = input.text;
    [self presentViewController:popUp animated:YES completion:nil];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}

@end
